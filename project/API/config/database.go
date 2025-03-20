package config

import (
	"database/sql"
	"log"
	_ "github.com/go-sql-driver/mysql"
)

// ConnectDB estabelece uma conexão com o banco de dados MySQL
func ConnectDB() (*sql.DB, error) {
	db, err := sql.Open("mysql", "root:Tcorde0@@tcp(127.0.0.1:3306)/rastreamento_app")
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	log.Println("Conexão com o banco de dados estabelecida com sucesso")
	return db, nil
}
