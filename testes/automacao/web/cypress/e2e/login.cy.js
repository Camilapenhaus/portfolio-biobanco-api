describe('Login no site', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // Caminho feliz
  it('Deve entrar no sistema com e-mail e senha válidos', () => {
    cy.fixture('carla').then((carla) => {
      cy.fazerLogin(carla.email, carla.senha);

      cy.get('[data-testid="mensagem"]').should('contain', `Bem-vindo(a), ${carla.nome}!`);
      cy.get('[data-testid="nome-usuario"]').should('contain', carla.nome);
      cy.get('[data-testid="catalogo"]').should('be.visible');
    });
  });

  // Partição de equivalência: senha inválida (CT-14 automatizado)
  it('Deve mostrar mensagem de erro quando a senha está errada', () => {
    cy.fixture('carla').then((carla) => {
      cy.fazerLogin(carla.email, 'senhaErrada');

      cy.get('[data-testid="mensagem"]').should('contain', 'E-mail ou senha inválidos');
      cy.get('[data-testid="form-login"]').should('be.visible');
    });
  });
});
