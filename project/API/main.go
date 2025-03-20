package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"rastreamento-api/config"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"golang.org/x/crypto/bcrypt"
)

type Driver struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Vehicle   string    `json:"vehicle"`
	License   string    `json:"license"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	LastSeen  time.Time `json:"last_seen"`
}

type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

var drivers = make(map[string]Driver)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var connections = make(map[*websocket.Conn]bool)
var connectionsMutex sync.Mutex

var driverLocations = make(map[string]Location)
var locationsMutex sync.Mutex

type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timestamp int64   `json:"timestamp"`
}

var db *sql.DB

var jwtKey = []byte("sua_chave_secreta_aqui")

type Claims struct {
	UserID string `json:"user_id"`
	jwt.StandardClaims
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func register(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Nome         string `json:"nome"`
		Email        string `json:"email"`
		Password     string `json:"password"`
		Role         string `json:"role"`
		Phone        string `json:"phone"`
		Unidade      string `json:"unidade"`
		PlacaVeiculo string `json:"placa_veiculo"`
		TipoVeiculo  string `json:"tipo_veiculo"`
	}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Erro ao decodificar o corpo da requisição: %v", err)
		return
	}

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		http.Error(w, "Erro ao criptografar senha", http.StatusInternalServerError)
		log.Printf("Erro ao criptografar senha: %v", err)
		return
	}

	var query string
	if user.Role == "admin" {
		query = "INSERT INTO admins (nome, email, password, phone, unidade) VALUES (?, ?, ?, ?, ?)"
		_, err = db.Exec(query, user.Nome, user.Email, hashedPassword, user.Phone, user.Unidade)
	} else if user.Role == "motorista" {
		query = "INSERT INTO motoristas (nome, email, password, phone, unidade, placa_veiculo, tipo_veiculo) VALUES (?, ?, ?, ?, ?, ?, ?)"
		_, err = db.Exec(query, user.Nome, user.Email, hashedPassword, user.Phone, user.Unidade, user.PlacaVeiculo, user.TipoVeiculo)
	} else {
		http.Error(w, "Papel (role) inválido", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "Erro ao registrar usuário", http.StatusInternalServerError)
		log.Printf("Erro ao registrar usuário: %v", err)
		return
	}

	log.Printf("Usuário registrado com sucesso: %s", user.Email)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Usuário registrado com sucesso"})
}

func login(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user struct {
		ID       string
		Email    string
		Password string
		Role     string
	}

	var query string
	if credentials.Role == "admin" {
		query = "SELECT id, email, password, role FROM admins WHERE email = ?"
	} else if credentials.Role == "motorista" {
		query = "SELECT id, email, password, role FROM motoristas WHERE email = ?"
	} else {
		http.Error(w, "Papel (role) inválido", http.StatusBadRequest)
		return
	}

	err := db.QueryRow(query, credentials.Email).Scan(&user.ID, &user.Email, &user.Password, &user.Role)
	if err != nil {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password))
	if err != nil {
		http.Error(w, "Senha incorreta", http.StatusUnauthorized)
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		http.Error(w, "Erro ao gerar token", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
		"role":  user.Role,
	})
}

func generateToken(userID string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func main() {
	db, err := config.ConnectDB()
	if err != nil {
		log.Fatalf("Erro ao conectar ao banco de dados: %v", err)
	}
	defer db.Close()

	r := mux.NewRouter()

	r.HandleFunc("/ws", handleWebSocket)
	r.HandleFunc("/drivers", getDrivers).Methods("GET")
	r.HandleFunc("/drivers/{id}", getDriver).Methods("GET")
	r.HandleFunc("/drivers", createDriver).Methods("POST")
	r.HandleFunc("/drivers/{id}/location", updateDriverLocation).Methods("PUT")
	r.HandleFunc("/drivers/{id}/track", getDriverTrack).Methods("GET")
	r.HandleFunc("/create-database", func(w http.ResponseWriter, r *http.Request) {
		db, err := sql.Open("mysql", "root:senha@tcp(localhost:3306)/")
		if err != nil {
			http.Error(w, fmt.Sprintf("Erro ao conectar ao MySQL: %v", err), http.StatusInternalServerError)
			return
		}
		defer db.Close()

		_, err = db.Exec("CREATE DATABASE IF NOT EXISTS `informacoes-registro-login`")
		if err != nil {
			http.Error(w, fmt.Sprintf("Erro ao criar banco de dados: %v", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Banco de dados 'informacoes-registro-login' criado com sucesso!"))
	}).Methods("POST")

	r.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		// Limpar a sessão do usuário
		http.SetCookie(w, &http.Cookie{
			Name:   "session_token",
			Value:  "",
			Path:   "/",
			MaxAge: -1,
		})
		// Redirecionar para a página de login
		http.Redirect(w, r, "/login", http.StatusFound)
	}).Methods("POST")

	r.HandleFunc("/registros", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, nome, email FROM usuarios")
		if err != nil {
			http.Error(w, fmt.Sprintf("Erro ao buscar registros: %v", err), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var registros []map[string]string
		for rows.Next() {
			var id, nome, email string
			if err := rows.Scan(&id, &nome, &email); err != nil {
				http.Error(w, fmt.Sprintf("Erro ao ler registro: %v", err), http.StatusInternalServerError)
				return
			}
			registros = append(registros, map[string]string{
				"id":    id,
				"nome":  nome,
				"email": email,
			})
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(registros)
	}).Methods("GET")

	r.HandleFunc("/register", register).Methods("POST")
	r.HandleFunc("/login", login).Methods("POST")

	log.Println("API rodando na porta 8080...")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Erro ao atualizar para WebSocket:", err)
		return
	}
	defer conn.Close()

	connectionsMutex.Lock()
	connections[conn] = true
	connectionsMutex.Unlock()

	for {
		var location Location
		err := conn.ReadJSON(&location)
		if err != nil {
			log.Println("Erro ao ler mensagem:", err)
			break
		}

		locationsMutex.Lock()
		driverLocations[conn.RemoteAddr().String()] = location
		locationsMutex.Unlock()

		broadcastLocation(location)
	}
}

func broadcastLocation(location Location) {
	connectionsMutex.Lock()
	defer connectionsMutex.Unlock()

	for conn := range connections {
		err := conn.WriteJSON(location)
		if err != nil {
			log.Println("Erro ao enviar mensagem:", err)
			conn.Close()
			delete(connections, conn)
		}
	}
}

func getDrivers(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(drivers)
}

func getDriver(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	if driver, ok := drivers[params["id"]]; ok {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(driver)
		return
	}
	http.Error(w, "Driver not found", http.StatusNotFound)
}

func createDriver(w http.ResponseWriter, r *http.Request) {
	var driver Driver
	if err := json.NewDecoder(r.Body).Decode(&driver); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	driver.LastSeen = time.Now()
	drivers[driver.ID] = driver
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(driver)
}

func updateDriverLocation(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	driver, ok := drivers[params["id"]]
	if !ok {
		http.Error(w, "Driver not found", http.StatusNotFound)
		return
	}

	var location struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	}
	if err := json.NewDecoder(r.Body).Decode(&location); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	driver.Latitude = location.Latitude
	driver.Longitude = location.Longitude
	driver.LastSeen = time.Now()
	drivers[driver.ID] = driver
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(driver)
}

func getDriverTrack(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	driverID := params["id"]

	locationsMutex.Lock()
	location, exists := driverLocations[driverID]
	locationsMutex.Unlock()

	if !exists {
		http.Error(w, "Motorista não encontrado", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(location)
}
