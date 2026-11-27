const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'biobanco-segredo-de-desenvolvimento';
const JWT_EXPIRA_EM = '2h';

function gerarToken(pesquisador) {
  return jwt.sign({ sub: pesquisador._id.toString(), email: pesquisador.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRA_EM
  });
}

function exigirLogin(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token não informado. Faça login para continuar.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.pesquisadorId = payload.sub;
    return next();
  } catch (_e) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = { gerarToken, exigirLogin };
