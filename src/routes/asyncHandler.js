// Encaminha erros de rotas assíncronas para o tratador de erros do Express.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
