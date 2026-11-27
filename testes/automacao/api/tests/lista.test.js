const request = require('supertest');
const { expect } = require('chai');
const { pegarBaseURL } = require('../helpers/variaveis');
const { criarPesquisadorEObterToken, buscarIdDaAmostra } = require('../helpers/autenticacao');

describe('Lista de solicitação', () => {
  let token;

  // Uma pesquisadora nova a cada execução: não é Parceira e não tem compras,
  // então o resultado não depende de testes anteriores.
  before(async () => {
    token = await criarPesquisadorEObterToken();
  });

  // Deixa a lista vazia depois de cada teste.
  afterEach(async () => {
    await request(pegarBaseURL())
      .delete('/api/lista')
      .set('Authorization', `Bearer ${token}`);
  });

  // Regra R1 - partição de equivalência: PIX tem 10% de desconto na taxa
  it('Deve aplicar 10% de desconto na taxa quando o pagamento é PIX', async () => {
    const idSangue = await buscarIdDaAmostra('BIO-001'); // taxa R$ 80,00

    await request(pegarBaseURL())
      .post('/api/lista/itens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amostraId: idSangue, quantidade: 1 })
      .expect(201);

    const resposta = await request(pegarBaseURL())
      .get('/api/lista/resumo')
      .query({ formaPagamento: 'pix' })
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.subtotal).to.equal(80);
    expect(resposta.body.desconto).to.equal(8);
    expect(resposta.body.transporte).to.equal(45);
    expect(resposta.body.total).to.equal(117);
  });

  // Regra R2 - amostra sem alíquotas não entra na lista (API-09 automatizado)
  it('Deve retornar 422 ao adicionar uma amostra sem alíquotas disponíveis', async () => {
    const idEcoli = await buscarIdDaAmostra('BIO-003'); // estoque 0

    const resposta = await request(pegarBaseURL())
      .post('/api/lista/itens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amostraId: idEcoli, quantidade: 1 });

    expect(resposta.status).to.equal(422);
    expect(resposta.body.erro).to.equal('Amostra sem alíquotas disponíveis no momento');
  });
});
