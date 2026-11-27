# Testes automatizados da API: BioBanco

Testes automatizados da API REST do BioBanco com **Mocha** (organiza e executa os testes), **Chai** (faz as verificações) e **Supertest** (envia as requisições HTTP).

Os cenários automatizados repetem testes que já tinham sido feitos manualmente:

| Arquivo | Teste | Origem manual | Técnica |
|---|---|---|---|
| `login.test.js` | Login com dados válidos retorna 200 e token | API-01 | Caminho feliz |
| `login.test.js` | Login com senha errada retorna 401 | CT-14 | Partição de equivalência |
| `lista.test.js` | PIX aplica 10% de desconto na taxa (R1) | CT-04 | Partição de equivalência |
| `lista.test.js` | Amostra sem alíquotas retorna 422 (R2) | API-09 / CT-08 | Partição de equivalência |
| `solicitacao.test.js` | Carla chega a R$ 300,00 e vira Parceira (R3) | CT-01 / API-06 | Análise do valor limite |

## Estrutura
```
api/
├── config/config.local.json   endereço da API
├── fixtures/postLogin.json    dados de login da Carla
├── helpers/                   funções reaproveitadas (login, cadastro, busca de amostra)
└── tests/                     os testes
```

## Como executar
1. Na raiz do projeto, inicie a aplicação (de preferência reiniciada, para os dados voltarem ao início):

```
npm start
```

2. Em outro terminal, entre nesta pasta e instale as dependências (só na primeira vez):

```
cd testes/automacao/api
```

```
npm install
```

3. Rode os testes:

```
npm test
```

4. Para gerar o relatório HTML (pasta `relatorio`):

```
npm run test:relatorio
```

## Observações
- **Pré-condição do CT-01:** a Carla precisa estar com R$ 250,00 e sem ser Parceira. Depois de uma execução, ela vira Parceira; para rodar de novo, reinicie a aplicação. Se esquecer, o teste avisa com a mensagem "Pré-condição não atendida".
- Os testes de lista criam uma pesquisadora nova a cada execução, então não dependem dos dados de outros testes.
- Para usar outro endereço: `BASE_URL=http://localhost:3000 npm test`.
- Todos os dados são fictícios.
