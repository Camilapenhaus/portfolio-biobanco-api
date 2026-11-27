# Testes do BioBanco

Esta pasta reúne todo o trabalho de testes do BioBanco: planejamento, testes manuais, testes exploratórios, acessibilidade, API, performance, automação, defeitos encontrados e evidências.

**Autora:** Camila Penha
**Contexto:** projeto de portfólio da Mentoria Júlio de Lima

## Por onde começar
1. **[Plano de testes](plano-de-testes.md):** objetivo, regras de negócio, técnicas escolhidas, condições de teste, dados e ambiente.
2. **[Casos de teste](casos-de-teste.md):** CT-01 a CT-16, com partição de equivalência, análise do valor limite e tabela de decisão.
3. **[Defeitos encontrados](bugs-encontrados.md):** BUG-01 a BUG-09, com severidade e prioridade.

## Documentos

| Documento | Conteúdo | Identificação |
|---|---|---|
| [plano-de-testes.md](plano-de-testes.md) | Planejamento completo dos testes | — |
| [casos-de-teste.md](casos-de-teste.md) | Casos de teste executados no site | CT-01 a CT-16 |
| [testes-exploratorios.md](testes-exploratorios.md) | Sessões exploratórias (SBTM) com heurísticas | EXP-01 a EXP-03 |
| [ideias-de-teste.md](ideias-de-teste.md) | Ideias de teste e testes de acessibilidade | ACE-01 a ACE-14, FUN-01 |
| [testes-api.md](testes-api.md) | Testes manuais da API pelo Swagger | API-01 a API-12 |
| [testes-performance.md](testes-performance.md) | Testes de carga e estresse com k6 | PERF-01 a PERF-03 |
| [testes-automatizados.md](testes-automatizados.md) | Testes automatizados da API e do site | 5 de API + 3 de web |
| [bugs-encontrados.md](bugs-encontrados.md) | Defeitos encontrados (registrados, sem correção) | BUG-01 a BUG-09 |

## Resumo dos resultados

| Tipo de teste | Quantidade | Resultado |
|---|---|---|
| Acessibilidade | 14 (ACE) | 4 defeitos (BUG-02 a BUG-05) |
| Casos de teste | 16 (CT) | 16 com sucesso |
| Exploratórios | 3 sessões (EXP) | 4 defeitos (BUG-06 a BUG-09) |
| API manual | 12 (API) | 11 com sucesso; API-12 falhou e confirmou o BUG-07 no servidor |
| Performance | 3 (PERF) | Lista e login aprovados com 10 usuários; login acima do limite com 20 usuários (risco registrado) |
| Automação da API | 5 | 5 aprovados |
| Automação do site | 3 | 3 aprovados |

## Pastas

| Pasta | Conteúdo |
|---|---|
| `automacao/api/` | Testes automatizados da API (Mocha, Chai e Supertest) e relatório HTML |
| `automacao/web/` | Testes automatizados do site (Cypress) |
| `performance/` | Scripts do k6 e relatórios HTML |
| `evidencias/` | Prints organizados por tipo de teste (acessibilidade, casos de teste, exploratórios, API, performance e automação) |

Cada pasta de automação e de performance tem um README com as instruções de execução.

## Como executar a aplicação
Na raiz do projeto:

```
npm install
```

```
npm start
```

Site: http://localhost:3000 · Swagger: http://localhost:3000/api-docs

Os dados são fictícios e ficam em um banco em memória: ao reiniciar a aplicação, eles voltam ao estado inicial.
