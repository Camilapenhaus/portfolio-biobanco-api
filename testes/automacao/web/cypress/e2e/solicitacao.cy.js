// CT-01 automatizado no site: a Carla tem R$ 250,00 pagos em taxas. Ao pedir
// 1 alíquota da BIO-006 (R$ 50,00) com Boleto, chega exatamente a R$ 300,00 e
// vira Pesquisadora Parceira (regra R3 - análise do valor limite).
describe('Solicitação de amostras no site (CT-01)', () => {
  before(() => {
    // Pré-condição, conferida pela API: a Carla ainda não pode ser Parceira.
    cy.fixture('carla').then((carla) => {
      cy.request('POST', '/api/auth/login', { email: carla.email, senha: carla.senha })
        .then((login) => {
          const token = login.body.token;
          cy.request({ url: '/api/pesquisadores/me', headers: { Authorization: `Bearer ${token}` } })
            .then((perfil) => {
              if (perfil.body.parceiro || perfil.body.totalGasto !== 250) {
                throw new Error(
                  'Pré-condição não atendida: a Carla já fez compras. Reinicie a aplicação (npm start) e rode de novo.'
                );
              }
            });
          cy.request({ method: 'DELETE', url: '/api/lista', headers: { Authorization: `Bearer ${token}` } });
        });
    });
  });

  it('Deve tornar a Carla Pesquisadora Parceira ao chegar a R$ 300,00 em taxas', () => {
    cy.visit('/');
    cy.fixture('carla').then((carla) => {
      cy.fazerLogin(carla.email, carla.senha);
    });

    // Antes da compra, a Carla não tem o selo de Parceira
    cy.get('[data-testid="selo-parceiro"]').should('not.be.visible');

    // Adiciona 1 alíquota da levedura (BIO-006, R$ 50,00)
    cy.get('[data-testid="adicionar-BIO-006"]').click();
    cy.get('[data-testid="item-lista-BIO-006"]').should('be.visible');

    // Boleto: sem desconto, com transporte de R$ 45,00
    cy.get('[data-testid="pagamento-boleto"]').check();
    cy.get('[data-testid="endereco"]').type('Rua das Pesquisas, 100 - Laboratório 2');
    cy.get('[data-testid="resumo-subtotal"]').should('contain', '50,00');
    cy.get('[data-testid="resumo-transporte"]').should('contain', '45,00');
    cy.get('[data-testid="resumo-total"]').should('contain', '95,00');

    cy.get('[data-testid="btn-finalizar"]').click();

    // Resultado esperado: mensagem de Parceira e selo no topo
    cy.get('[data-testid="mensagem"]').should('contain', 'Pesquisador Parceiro');
    cy.get('[data-testid="selo-parceiro"]').should('be.visible');
  });
});
