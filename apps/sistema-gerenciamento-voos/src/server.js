require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { getFlights } = require('./controllers/flightsController');

// Configuração do Express
const app = express();
app.use(express.json());

// Configuração do MongoDB e modelos
require('./models/Flight'); // Deve vir antes de qualquer uso do modelo
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
  // Verifica se os índices estão corretos
  mongoose.model('Flight').ensureIndexes()
    .then(() => console.log('Índices verificados com sucesso'))
    .catch(err => console.error('Erro ao verificar índices:', err));
});

// Conexão com MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/aerogest', {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  retryWrites: true,
  retryReads: true
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Rotas
app.get('/api/flights', getFlights);

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada não tratada:', err);
});

// Função para obter porta disponível
const getAvailablePort = (desiredPort) => {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.unref();
    server.on('error', () => resolve(getAvailablePort(0)));
    server.listen(desiredPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
};

// Inicialização do servidor
const startServer = async () => {
  const PORT = process.env.PORT || 3001;
  const availablePort = await getAvailablePort(PORT);
  
  const server = app.listen(availablePort, () => {
    console.log(`Servidor rodando na porta ${availablePort}`);
  });

  // Verifica se está usando a porta desejada ou alternativa
  if (availablePort !== PORT) {
    console.warn(`Atenção: Porta ${PORT} ocupada, usando porta ${availablePort} como alternativa`);
  }

  return server;
};

// Inicialização segura do servidor
startServer().then(server => {
  // Tratamento de erros do servidor
  server.on('error', (err) => {
    console.error('Erro no servidor:', err);
  });
}).catch(err => {
  console.error('Falha ao iniciar servidor:', err);
  process.exit(1);
});
