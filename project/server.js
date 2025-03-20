const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { name, email, password, phone, type } = req.body;
  // Lógica de registro aqui
  res.json({ token: 'fake-token-for-testing' });
});

const PORT = 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
