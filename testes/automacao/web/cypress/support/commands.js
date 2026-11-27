// Comando personalizado: faz o login pela tela do site.
Cypress.Commands.add('fazerLogin', (email, senha) => {
  cy.get('[data-testid="login-email"]').type(email);
  cy.get('[data-testid="login-senha"]').type(senha, { log: false });
  cy.get('[data-testid="btn-entrar"]').click();
});
