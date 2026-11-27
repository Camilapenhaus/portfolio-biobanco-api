const request = require('supertest');
const { expect } = require('chai');
const { pegarBaseURL } = require('../helpers/variaveis');
const postLogin = require('../fixtures/postLogin.json');

describe('Login', () => {
  // Caminho feliz (API-01 automatizado)
  it('Deve retornar 200 e um token quando o e-mail e a senha são válidos', async () => {
    const resposta = await request(pegarBaseURL())
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send(postLogin);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.token).to.be.a('string');
    expect(resposta.body.pesquisador.email).to.equal('carla.mendes@biobanco.test');
  });

  // Partição de equivalência: senha inválida (CT-14 automatizado)
  it('Deve retornar 401 quando a senha está errada', async () => {
    const resposta = await request(pegarBaseURL())
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: postLogin.email, senha: 'senhaErrada' });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.erro).to.equal('E-mail ou senha inválidos');
  });
});
