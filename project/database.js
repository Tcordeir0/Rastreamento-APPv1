const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tcorde0@',
  database: 'rastreamento_app'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.stack);
    return;
  }
  console.log('Conectado ao MySQL com o ID:', connection.threadId);
});

module.exports = connection;
