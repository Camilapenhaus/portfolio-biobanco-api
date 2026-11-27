# Testes automatizados: BioBanco

Com base nos módulos estudados na mentoria, foram automatizados testes na **API** e no **site**. Todos os cenários automatizados já tinham sido executados manualmente antes. A automação não substitui esses testes: ela permite repetir os cenários mais importantes de forma rápida e sempre igual (o que no módulo é chamado de *checking*).

- **Data:** 26 de novembro de 2026
- **Testadora:** Camila Penha
- **Ambiente:** MacBook Air (Intel, 8 GB), macOS Sonoma, aplicação local em http://localhost:3000

## 1. Testes automatizados da API

**Ferramentas:** Mocha (organiza e executa os testes), Chai (verificações) e Supertest (envio das requisições HTTP).
**Pasta:** `testes/automacao/api`

| Grupo (`describe`) | Teste (`it`) | Origem manual | Técnica |
|---|---|---|---|
| Login | Deve retornar 200 e um token quando o e-mail e a senha são válidos | API-01 | Caminho feliz |
| Login | Deve retornar 401 quando a senha está errada | CT-14 | Partição de equivalência |
| Lista de solicitação | Deve aplicar 10% de desconto na taxa quando o pagamento é PIX (R1) | CT-04 | Partição de equivalência |
| Lista de solicitação | Deve retornar 422 ao adicionar uma amostra sem alíquotas disponíveis (R2) | API-09 / CT-08 | Partição de equivalência |
| Solicitação de amostras (CT-01) | Deve tornar a Carla Pesquisadora Parceira ao chegar a R$ 300,00 em taxas (R3) | CT-01 / API-06 | Análise do valor limite |

**Resultado:** 5 testes aprovados (`5 passing`). Relatório HTML em `testes/automacao/api/relatorio/relatorio-api.html`.

## 2. Testes automatizados do site

**Ferramenta:** Cypress. Os elementos da tela são localizados pelo atributo `data-testid`.
**Pasta:** `testes/automacao/web`

| Grupo (`describe`) | Teste (`it`) | Origem manual | Técnica |
|---|---|---|---|
| Login no site | Deve entrar no sistema com e-mail e senha válidos | — | Caminho feliz |
| Login no site | Deve mostrar mensagem de erro quando a senha está errada | CT-14 | Partição de equivalência |
| Solicitação de amostras no site (CT-01) | Deve tornar a Carla Pesquisadora Parceira ao chegar a R$ 300,00 em taxas | CT-01 | Análise do valor limite |

No teste do CT-01, o Cypress entra como Carla, adiciona a BIO-006, escolhe Boleto, confere subtotal (R$ 50,00), transporte (R$ 45,00) e total (R$ 95,00), confirma a solicitação e verifica a mensagem e o selo de Pesquisadora Parceira.

**Resultado:** `All specs passed!`: 3 testes aprovados em 15 segundos.

## 3. Preparação dos dados
O teste do CT-01 (na API e no site) **muda os dados**: depois dele, a Carla passa a ser Parceira. Por isso:
- a aplicação precisa ser reiniciada antes de cada execução desse teste (o banco em memória volta aos dados iniciais);
- o próprio teste confere essa pré-condição antes de começar e, se a Carla já for Parceira, avisa: *"Pré-condição não atendida: reinicie a aplicação"*;
- os testes de lista da API criam uma pesquisadora nova a cada execução e esvaziam a lista no final, para não depender de outros testes.

## 4. Falhas durante a execução
Durante a execução, duas falhas foram investigadas:

| Falha | Causa | Onde estava o problema |
|---|---|---|
| 3 testes da API com `expected 201, got 400` | o teste buscava o campo `_id` da amostra, mas a API devolve `id` | No próprio teste (corrigido) |
| Teste do CT-01 no site com `cy.request() failed` | o teste começou antes de a aplicação terminar de subir | No ambiente |

Nenhuma das duas era um defeito da aplicação. Antes de concluir que um teste automatizado encontrou um defeito, é preciso confirmar se o problema está na aplicação, no próprio teste ou no ambiente.

## 5. Como executar
As instruções completas estão no README de cada pasta. Resumo:

1. Na raiz do projeto, iniciar a aplicação com `npm start`.
2. Testes da API: na pasta `testes/automacao/api`, executar `npm install` (primeira vez) e `npm test`.
3. Testes do site: na pasta `testes/automacao/web`, executar `npm install` (primeira vez) e `npm test` (ou `npm run cy:open` para acompanhar no navegador).

## 6. Evidências
Prints em `testes/evidencias/automacao`: AUTO-API-01 (terminal com 5 testes aprovados), AUTO-WEB-01 (CT-01 no Cypress), AUTO-WEB-02 (login no Cypress) e AUTO-WEB-03 (execução completa no terminal).
