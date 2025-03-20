const connection = require('./database');

connection.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Erro ao testar a conexão com o MySQL:', err.stack);
    return;
  }
  console.log('Conexão com o MySQL testada com sucesso:', results);
});
