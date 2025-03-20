import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
  error: null,
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = (email: string) => email.endsWith('@borgnotransportes.com.br');

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://api.example.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      setToken(data.token);
      setRole(data.role);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
