const register = async (name, email, password, phone, type) => {
  try {
    console.log('Iniciando requisição de registro...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    console.log('Enviando dados para o servidor...');
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, type }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta:', errorData);
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    console.log('Registro realizado com sucesso:', data);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Erro: Requisição expirada após 30 segundos');
      throw new Error('Request timed out');
    }
    console.error('Erro na requisição:', error);
    throw new Error(error.message || 'Network request failed');
  }
};

module.exports = register;