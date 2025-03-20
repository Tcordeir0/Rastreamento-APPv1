import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatabaseService } from '../services/DatabaseService';

// Definindo o tipo de perfil de usuário
type UserProfile = 'admin' | 'driver' | null;

// Interface para o estado de autenticação
interface AuthState {
  isLoggedIn: boolean;
  userProfile: UserProfile;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
}

// Interface para o contexto
interface AuthContextType extends AuthState {
  signIn: (profile: UserProfile) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  login: (token: string, userType: 'admin' | 'driver') => Promise<void>;
  resetOnboarding: () => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, type: string) => Promise<{ success: boolean, userType: 'admin' | 'driver' }>;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Provedor do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    userProfile: null,
    hasCompletedOnboarding: false,
    isLoading: true,
    userId: null,
    userName: null,
    userEmail: null,
  });

  // Carregar o estado de autenticação ao iniciar
  useEffect(() => {
    async function loadAuthState() {
      try {
        const [
          onboardingCompleted,
          userProfile,
          isLoggedIn,
          userId,
          userName,
          userEmail,
        ] = await Promise.all([
          AsyncStorage.getItem('@RastreioApp:onboardingCompleted'),
          AsyncStorage.getItem('@RastreioApp:userProfile'),
          AsyncStorage.getItem('@RastreioApp:isLoggedIn'),
          AsyncStorage.getItem('@RastreioApp:userId'),
          AsyncStorage.getItem('@RastreioApp:userName'),
          AsyncStorage.getItem('@RastreioApp:userEmail'),
        ]);

        setState({
          isLoggedIn: isLoggedIn === 'true',
          userProfile: (userProfile as UserProfile) || null,
          hasCompletedOnboarding: onboardingCompleted === 'true',
          isLoading: false,
          userId,
          userName,
          userEmail,
        });
      } catch (error) {
        console.error('Erro ao carregar estado de autenticação:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }

    loadAuthState();
  }, []);

  // Função para realizar login com token da API
  const login = async (token: string, userType: 'admin' | 'driver') => {
    try {
      // Guardar token de autenticação
      await AsyncStorage.setItem('@RastreioApp:token', token);
      await AsyncStorage.setItem('@RastreioApp:userType', userType);
      await AsyncStorage.setItem('@RastreioApp:isLoggedIn', 'true');
      await AsyncStorage.setItem('@RastreioApp:userProfile', userType);
      
      setState(prev => ({
        ...prev,
        isLoggedIn: true,
        userProfile: userType,
      }));
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Função para realizar login (versão anterior para compatibilidade)
  const signIn = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem('@RastreioApp:isLoggedIn', 'true');
      await AsyncStorage.setItem('@RastreioApp:userProfile', profile || '');
      
      setState(prev => ({
        ...prev,
        isLoggedIn: true,
        userProfile: profile,
      }));
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Função para realizar logout
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@RastreioApp:isLoggedIn');
      await AsyncStorage.removeItem('@RastreioApp:token');
      await AsyncStorage.removeItem('@RastreioApp:userType');
      await AsyncStorage.removeItem('@RastreioApp:userId');
      await AsyncStorage.removeItem('@RastreioApp:userName');
      await AsyncStorage.removeItem('@RastreioApp:userEmail');
      
      setState(prev => ({
        ...prev,
        isLoggedIn: false,
        userProfile: null,
        userId: null,
        userName: null,
        userEmail: null,
      }));
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // Função para marcar o onboarding como concluído
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@RastreioApp:onboardingCompleted', 'true');
      
      setState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
      }));
    } catch (error) {
      console.error('Erro ao salvar estado do onboarding:', error);
      throw error;
    }
  };
  
  // Função para reiniciar o onboarding
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@RastreioApp:onboardingCompleted');
      await AsyncStorage.removeItem('@RastreioApp:onboardingStarted');
      
      setState(prev => ({
        ...prev,
        hasCompletedOnboarding: false,
      }));
    } catch (error) {
      console.error('Erro ao reiniciar onboarding:', error);
      throw error;
    }
  };

  // Função para registrar usuário
  const register = async (name: string, email: string, password: string, phone: string, type: string) => {
    try {
      console.log('Iniciando registro do usuário:', { name, email, type });
      const { success, userType } = await DatabaseService.registerUser(name, email, password, phone, type);
      
      if (success) {
        console.log('Registro bem-sucedido. Salvando dados locais...');
        await AsyncStorage.setItem('userProfile', JSON.stringify({
          isLoggedIn: true,
          userProfile: userType,
          hasCompletedOnboarding: true,
          isLoading: false,
          userId: crypto.randomUUID(),
          userName: name,
          userEmail: email
        }));

        console.log('Atualizando estado do contexto...');
        setState(prev => ({
          ...prev,
          isLoggedIn: true,
          userProfile: userType,
          hasCompletedOnboarding: true,
          isLoading: false,
          userId: crypto.randomUUID(),
          userName: name,
          userEmail: email
        }));
      }

      console.log('Registro concluído com sucesso.');
      return { success, userType };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    signIn,
    signOut,
    completeOnboarding,
    login,
    resetOnboarding,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
