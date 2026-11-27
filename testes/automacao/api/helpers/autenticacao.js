const request = require('supertest');
const { pegarBaseURL } = require('./variaveis');
const loginPadrao = require('../fixtures/postLogin.json');

// Faz o login e devolve o token recebido.
// Sem argumentos, usa a pesquisadora do arquivo fixtures/postLogin.json (Carla).
async function obterToken(email = loginPadrao.email, senha = loginPadrao.senha) {
  const resposta = await request(pegarBaseURL())
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email, senha });
  return resposta.body.token;
}

// Cadastra um pesquisador novo, com e-mail único, e devolve o token dele.
// Usado nos testes que não podem depender do histórico de compras da Carla.
async function criarPesquisadorEObterToken() {
  const email = `auto.api.${Date.now()}@biobanco.test`;
  const senha = '123456';
  await request(pegarBaseURL())
    .post('/api/auth/cadastro')
    .set('Content-Type', 'application/json')
    .send({ nome: 'Pesquisadora Automação', email, senha, instituicao: 'Laboratório de Automação' });
  return obterToken(email, senha);
}

// Procura o id de uma amostra pelo código (ex.: 'BIO-006').
async function buscarIdDaAmostra(codigo) {
  const resposta = await request(pegarBaseURL()).get('/api/amostras');
  const amostra = resposta.body.find((item) => item.codigo === codigo);
  return amostra.id;
}

module.exports = { obterToken, criarPesquisadorEObterToken, buscarIdDaAmostra };
