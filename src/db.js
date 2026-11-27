const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let servidorMongo;

// Sobe um MongoDB em memória: os dados somem quando a aplicação para.
async function conectar() {
  servidorMongo = await MongoMemoryServer.create();
  await mongoose.connect(servidorMongo.getUri(), { dbName: 'biobanco' });
}

async function desconectar() {
  await mongoose.disconnect();
  if (servidorMongo) await servidorMongo.stop();
}

module.exports = { conectar, desconectar };
