export interface DriverSignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  license: string;
  unit: string;
}

export const registerDriver = async (data: DriverSignupData) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 segundos

    const response = await fetch('https://api.sistema.com/drivers/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao registrar motorista');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Tempo de requisição excedido');
    }
    throw new Error(error.message || 'Erro de conexão');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro no servidor');
    }

    const data = await response.json();

    if (!data.token || !data.userType) {
      throw new Error('Resposta inválida do servidor');
    }

    return data;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    throw error;
  }
};
