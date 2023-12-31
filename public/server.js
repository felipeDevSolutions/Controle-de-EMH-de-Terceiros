const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const port = 3000;

// Define o diretório de recursos estáticos (onde o login.html está localizado)
app.use(express.static(path.join(__dirname)));

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Inicia o servidor
http.createServer(app).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
