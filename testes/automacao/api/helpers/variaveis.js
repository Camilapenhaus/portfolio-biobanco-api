const configLocal = require('../config/config.local.json');

// Endereço da API. Pode ser trocado pela variável de ambiente BASE_URL.
function pegarBaseURL() {
  return process.env.BASE_URL || configLocal.baseURL;
}

module.exports = { pegarBaseURL };
