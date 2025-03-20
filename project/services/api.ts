// Remover o objeto existente e colocar nossa implementação completa
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base do axios
const BASE_URL = 'https://rastreamentoapp-api.example.com';

// Cliente axios com configurações padrão
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar token de autenticação
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('@RastreioApp:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Tipos
export interface AdminSignupData {
  name: string;
  email: string;
  password: string;
  unidade: string; // 'matriz' ou 'filial'
  filial?: string; // Nome da filial quando unidade for 'filial'
  phone: string;
}

export interface DriverSignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  license: string;
  licenseDueDate?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  userType: 'admin' | 'driver';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Simulação de API para desenvolvimento - será substituída por chamadas reais
// Isso permite o desenvolvimento da UI enquanto a API está sendo finalizada
const simulateApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// API
export const api = {
  // Autenticação
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      // return response.data;
      
      // Simulação para desenvolvimento
      if (email === 'admin@teste.com' && password === '123456') {
        return simulateApiCall({
          token: 'admin-fake-token-12345',
          userType: 'admin',
          user: {
            id: '1',
            name: 'Admin Teste',
            email: 'admin@teste.com',
          },
        });
      } else if (email === 'motorista@teste.com' && password === '123456') {
        return simulateApiCall({
          token: 'driver-fake-token-12345',
          userType: 'driver',
          user: {
            id: '2',
            name: 'Motorista Teste',
            email: 'motorista@teste.com',
          },
        });
      }
      
      throw new Error('Credenciais inválidas');
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.message || 'Falha na autenticação');
    }
  },
  
  registerAdmin: async (data: AdminSignupData): Promise<AuthResponse> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.post<AuthResponse>('/auth/register/admin', data);
      // return response.data;
      
      // Simulação para desenvolvimento
      return simulateApiCall({
        token: 'admin-new-token-12345',
        userType: 'admin',
        user: {
          id: '3',
          name: data.name,
          email: data.email,
        },
      });
    } catch (error: any) {
      console.error('Erro no cadastro de admin:', error);
      throw new Error(error.response?.data?.message || 'Falha no cadastro');
    }
  },
  
  registerDriver: async (data: DriverSignupData): Promise<AuthResponse> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.post<AuthResponse>('/auth/register/driver', data);
      // return response.data;
      
      // Simulação para desenvolvimento
      return simulateApiCall({
        token: 'driver-new-token-12345',
        userType: 'driver',
        user: {
          id: '4',
          name: data.name,
          email: data.email,
        },
      });
    } catch (error: any) {
      console.error('Erro no cadastro de motorista:', error);
      throw new Error(error.response?.data?.message || 'Falha no cadastro');
    }
  },
  
  forgotPassword: async (email: string): Promise<void> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // await apiClient.post('/auth/forgot-password', { email });
      
      // Simulação para desenvolvimento
      return simulateApiCall(undefined);
    } catch (error: any) {
      console.error('Erro na recuperação de senha:', error);
      throw new Error(error.response?.data?.message || 'Falha na recuperação de senha');
    }
  },
  
  // Perfil do usuário
  getUserProfile: async (): Promise<any> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.get('/user/profile');
      // return response.data;
      
      // Simulação para desenvolvimento
      const token = await AsyncStorage.getItem('@RastreioApp:token');
      const userType = await AsyncStorage.getItem('@RastreioApp:userType');
      
      if (!token) throw new Error('Usuário não autenticado');
      
      if (userType === 'admin') {
        return simulateApiCall({
          id: '1',
          name: 'Admin Teste',
          email: 'admin@teste.com',
          company: 'Borgno',
          phone: '(11) 98765-4321',
          role: 'admin',
        });
      } else {
        return simulateApiCall({
          id: '2',
          name: 'Motorista Teste',
          email: 'motorista@teste.com',
          phone: '(11) 91234-5678',
          license: '12345678900',
          licenseDueDate: '31/12/2025',
          address: 'Av. Paulista, 1000',
          role: 'driver',
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar perfil');
    }
  },
  
  updateProfile: async (data: any): Promise<any> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.put('/user/profile', data);
      // return response.data;
      
      // Simulação para desenvolvimento
      return simulateApiCall({ ...data, updated: true });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error(error.response?.data?.message || 'Falha ao atualizar perfil');
    }
  },
  
  // Veículos
  getVehicles: async (): Promise<any[]> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.get('/vehicles');
      // return response.data;
      
      // Simulação para desenvolvimento
      return simulateApiCall([
        {
          id: '1',
          plate: 'ABC1234',
          model: 'Volvo FH',
          year: 2020,
          status: 'active',
          lastLocation: {
            latitude: -23.5505,
            longitude: -46.6333,
            updatedAt: new Date().toISOString(),
          },
        },
        {
          id: '2',
          plate: 'DEF5678',
          model: 'Scania R450',
          year: 2021,
          status: 'maintenance',
          lastLocation: {
            latitude: -23.5605,
            longitude: -46.6233,
            updatedAt: new Date().toISOString(),
          },
        },
        {
          id: '3',
          plate: 'GHI9012',
          model: 'Mercedes-Benz Actros',
          year: 2019,
          status: 'active',
          lastLocation: {
            latitude: -23.5705,
            longitude: -46.6433,
            updatedAt: new Date().toISOString(),
          },
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao buscar veículos:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar veículos');
    }
  },
  
  // Motoristas
  getDrivers: async (): Promise<any[]> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.get('/drivers');
      // return response.data;
      
      // Simulação para desenvolvimento
      return simulateApiCall([
        {
          id: '1',
          name: 'João Silva',
          phone: '(11) 91234-5678',
          license: '12345678900',
          licenseDueDate: '31/12/2025',
          status: 'available',
        },
        {
          id: '2',
          name: 'Pedro Santos',
          phone: '(11) 98765-4321',
          license: '09876543211',
          licenseDueDate: '15/06/2024',
          status: 'driving',
        },
        {
          id: '3',
          name: 'Carlos Oliveira',
          phone: '(11) 94321-8765',
          license: '45678901234',
          licenseDueDate: '20/10/2023',
          status: 'rest',
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao buscar motoristas:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar motoristas');
    }
  },
  
  // Relatórios
  getReports: async (type: string, startDate: string, endDate: string): Promise<any[]> => {
    try {
      // Versão final - descomentar quando a API estiver pronta
      // const response = await apiClient.get(`/reports?type=${type}&startDate=${startDate}&endDate=${endDate}`);
      // return response.data;
      
      // Simulação para desenvolvimento
      return simulateApiCall([
        {
          id: '1',
          type: 'trip',
          vehicle: 'ABC1234',
          driver: 'João Silva',
          startDate: '2023-05-01T08:00:00Z',
          endDate: '2023-05-03T16:00:00Z',
          distance: 1200,
          fuelConsumption: 450,
        },
        {
          id: '2',
          type: 'maintenance',
          vehicle: 'DEF5678',
          date: '2023-05-10T10:00:00Z',
          description: 'Troca de óleo e filtros',
          cost: 1500,
        },
        {
          id: '3',
          type: 'incident',
          vehicle: 'GHI9012',
          driver: 'Carlos Oliveira',
          date: '2023-05-15T14:30:00Z',
          description: 'Pneu furado',
          location: 'Rodovia BR-101, KM 432',
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao buscar relatórios:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar relatórios');
    }
  },
  
  // Reiniciar onboarding
  resetOnboarding: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('@RastreioApp:hasCompletedOnboarding');
      await AsyncStorage.removeItem('@RastreioApp:onboardingStarted');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao reiniciar onboarding:', error);
      throw new Error('Falha ao reiniciar o tutorial');
    }
  }
};

export default api;

// Configuração da API Go
const GO_API_URL = 'http://192.168.1.22:8080';

// Funções específicas para a API Go
export const goApi = {
  registerDriver: async (driverData: any) => {
    try {
      const response = await axios.post(`${GO_API_URL}/drivers`, driverData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao cadastrar motorista:', error);
      throw new Error(error.response?.data?.message || 'Falha no cadastro');
    }
  },

  updateDriverLocation: async (driverId: string, location: any) => {
    try {
      const response = await axios.put(`${GO_API_URL}/drivers/${driverId}/location`, location);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar localização:', error);
      throw new Error(error.response?.data?.message || 'Falha na atualização');
    }
  },

  getDrivers: async () => {
    try {
      const response = await axios.get(`${GO_API_URL}/drivers`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar motoristas:', error);
      throw new Error(error.response?.data?.message || 'Falha na busca');
    }
  }
};