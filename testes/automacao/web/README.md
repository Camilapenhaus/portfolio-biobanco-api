# Testes automatizados do site: BioBanco

Testes de ponta a ponta (E2E) do site do BioBanco com **Cypress**. O Cypress abre o navegador e usa o site como uma pessoa usaria: digita, clica e confere o que aparece na tela.

| Arquivo | Teste | Origem manual | Técnica |
|---|---|---|---|
| `login.cy.js` | Login com dados válidos entra no sistema | — | Caminho feliz |
| `login.cy.js` | Senha errada mostra "E-mail ou senha inválidos" | CT-14 | Partição de equivalência |
| `solicitacao.cy.js` | Carla chega a R$ 300,00 com Boleto e vira Parceira (R3) | CT-01 | Análise do valor limite |

Os elementos da tela são localizados pelo atributo `data-testid`, que não muda quando o visual do site muda.

## Estrutura
```
web/
├── cypress.config.js          endereço do site (baseUrl) e gravação de vídeo
└── cypress/
    ├── e2e/                   os testes (*.cy.js)
    ├── fixtures/carla.json    dados de login da Carla
    └── support/commands.js    comando personalizado cy.fazerLogin()
```

## Como executar
1. Na raiz do projeto, inicie a aplicação reiniciada (a Carla precisa estar com R$ 250,00):

```
npm start
```

2. Em outro terminal, entre nesta pasta e instale o Cypress (só na primeira vez):

```
cd testes/automacao/web
```

```
npm install
```

3. Para ver o robô clicando no site (modo interativo):

```
npm run cy:open
```

4. Para rodar direto no terminal, com vídeo gravado em `cypress/videos`:

```
npm test
```

## Observações
- **Pré-condição do CT-01:** a Carla não pode já ser Parceira. O teste confere isso pela API antes de começar e avisa com "Pré-condição não atendida" se for preciso reiniciar a aplicação.
- Os testes de API (`../api`) e os do site usam a mesma Carla: reinicie a aplicação entre uma execução e outra.
- Todos os dados são fictícios.
