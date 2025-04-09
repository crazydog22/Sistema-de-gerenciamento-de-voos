const net = require('net');
const mongoose = require('mongoose');

async function cleanPorts() {
  try {
    // Fecha conexão com MongoDB se existir
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Conexão com MongoDB encerrada');
    }

    // Verifica porta 3001
    const port = 3001;
    const server = net.createServer();
    server.unref();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} está ocupada. Execute manualmente:`);
        console.log(`netstat -ano | findstr :${port}`);
        console.log('E depois:');
        console.log(`taskkill /PID PID_ENCONTRADO /F`);
      }
    });

    server.listen(port, () => {
      console.log(`Porta ${port} está disponível`);
      server.close();
    });
  } catch (err) {
    console.error('Erro ao limpar portas:', err);
  }
}

cleanPorts();
