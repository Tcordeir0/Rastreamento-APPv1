const register = require('./register');

(async () => {
  try {
    // Teste de registro como admin
    const adminUser = await register('Admin Test', 'admin@test.com', 'admin123', '123456789', 'admin');
    console.log('Admin registrado com sucesso:', adminUser);

    // Teste de registro como motorista
    const driverUser = await register('Driver Test', 'driver@test.com', 'driver123', '987654321', 'driver');
    console.log('Motorista registrado com sucesso:', driverUser);
  } catch (error) {
    console.error('Erro durante o registro:', error.message);
  }
})();
