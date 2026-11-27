const request = require('supertest');
const { expect } = require('chai');
const { pegarBaseURL } = require('../helpers/variaveis');
const { obterToken, buscarIdDaAmostra } = require('../helpers/autenticacao');

// CT-01 automatizado: a Carla tem R$ 250,00 pagos em taxas. Ao pedir 1 alíquota
// da BIO-006 (R$ 50,00) com Boleto, chega exatamente a R$ 300,00 e vira
// Pesquisadora Parceira (regra R3 - análise do valor limite).
describe('Solicitação de amostras (CT-01)', () => {
  let token;

  before(async function () {
    token = await obterToken();

    // Pré-condição: a Carla ainda não pode ser Parceira.
    const perfil = await request(pegarBaseURL())
      .get('/api/pesquisadores/me')
      .set('Authorization', `Bearer ${token}`);

    if (perfil.body.parceiro || perfil.body.totalGasto !== 250) {
      throw new Error(
        'Pré-condição não atendida: a Carla já fez compras. Reinicie a aplicação (npm start) e rode de novo.'
      );
    }

    await request(pegarBaseURL())
      .delete('/api/lista')
      .set('Authorization', `Bearer ${token}`);
  });

  it('Deve tornar a Carla Pesquisadora Parceira ao chegar a R$ 300,00 em taxas', async () => {
    const idLevedura = await buscarIdDaAmostra('BIO-006');

    await request(pegarBaseURL())
      .post('/api/lista/itens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amostraId: idLevedura, quantidade: 1 })
      .expect(201);

    const resposta = await request(pegarBaseURL())
      .post('/api/solicitacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({ formaPagamento: 'boleto', enderecoEntrega: 'Rua das Pesquisas, 100 - Laboratório 2' });

    expect(resposta.status).to.equal(201);
    expect(resposta.body.mensagem).to.include('Pesquisador Parceiro');
    expect(resposta.body.solicitacao.total).to.equal(95);
    expect(resposta.body.pesquisador.parceiro).to.equal(true);
    expect(resposta.body.pesquisador.totalGasto).to.equal(300);
  });
});
