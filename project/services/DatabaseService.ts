import { NativeModules } from 'react-native';

interface DatabaseService {
  registerUser(name: string, email: string, password: string, phone: string, type: string): Promise<{ success: boolean, userType: 'admin' | 'driver' }>;
}

export const DatabaseService: DatabaseService = {
  async registerUser(name: string, email: string, password: string, phone: string, type: string) {
    try {
      const response = await NativeModules.DatabaseModule.registerUser(
        name,
        email,
        password,
        phone,
        type
      );
      return response;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }
};
