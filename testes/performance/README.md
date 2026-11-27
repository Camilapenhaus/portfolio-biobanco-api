# Testes de performance do BioBanco (k6)

Testes de performance da API do BioBanco, escritos com [k6](https://k6.io/). Seguem a estrutura e as práticas estudadas no módulo de testes de performance da mentoria: scripts separados por fluxo, helper de autenticação, fixture de login, URL base configurável, checks e thresholds.

## Objetivo
Responder à pergunta: **o BioBanco atende 10 pesquisadores usando o sistema ao mesmo tempo, com menos de 1% de falhas e 95% das respostas em até 500 ms?**

| Teste | Fluxo | Cenário | Configuração |
|---|---|---|---|
| PERF-01 | Login (`POST /api/auth/login`) | Carga esperada (load) | 10 VUs, 50 iterações, pausa de 0,3 s |
| PERF-02 | Adicionar e remover amostra da lista (`POST /api/lista/itens` e `DELETE /api/lista/itens/{id}`) | Carga esperada (load) | 10 VUs por 30 segundos, pausa de 0,3 s |

**Critérios de aprovação (thresholds):**
- `http_req_failed`: taxa de falhas menor que 1% (`rate<0.01`);
- `http_req_duration`: 95% das respostas em até 500 ms (`p(95)<500`).

No PERF-02, cada usuário virtual usa uma conta própria, criada na preparação do teste (`setup`). Assim, cada um mexe apenas na sua lista, e o login não entra na medição. Os thresholds do PERF-02 valem só para as requisições do fluxo medido (marcadas com a tag `fluxo:lista`).

O fluxo de confirmar a solicitação não foi usado porque consome o estoque de verdade (a BIO-006 tem 12 alíquotas), o que geraria falhas por falta de estoque e não por desempenho.

## Estrutura
```
testes/performance/
├── config/
│   └── config.local.json     # URL base local (http://localhost:3000)
├── fixtures/
│   └── postLogin.json        # dados de login da pesquisadora de teste
├── helpers/
│   └── autenticacao.js       # obterToken() e cadastrarPesquisador()
├── tests/
│   ├── login.test.js         # PERF-01
│   └── lista.test.js         # PERF-02
├── utils/
│   └── variaveis.js          # pegarBaseURL(): BASE_URL ou config.local.json
└── README.md
```

## Pré-requisitos
- k6 instalado (no Mac: `brew install k6`; conferir com `k6 --version`).
- Aplicação BioBanco rodando (`npm start` na raiz do projeto).

## Como executar
Os comandos devem ser rodados **dentro da pasta `testes/performance`**.

```
k6 run tests/login.test.js
```

```
k6 run tests/lista.test.js
```

Para informar outra URL base:

```
k6 run -e BASE_URL=http://localhost:3000 tests/login.test.js
```

## Dashboard e relatório HTML
```
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=1s K6_WEB_DASHBOARD_EXPORT=relatorio-login.html k6 run tests/login.test.js
```

```
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=relatorio-lista.html k6 run tests/lista.test.js
```

```
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=1s K6_WEB_DASHBOARD_EXPORT=relatorio-estresse-login.html k6 run --vus 20 --iterations 100 tests/login.test.js
```

Durante a execução, o dashboard fica disponível em http://localhost:5665. Se a aba do dashboard estiver aberta, o k6 espera ela ser fechada para encerrar. Ao final, o relatório é salvo no arquivo HTML indicado.

`K6_WEB_DASHBOARD_PERIOD=1s` é necessário nos testes curtos (login e estresse, de 3 a 6 segundos): o dashboard agrega os dados a cada 10 segundos por padrão e, sem esse ajuste, o relatório não é gravado.

Os relatórios gerados (`relatorio-login.html`, `relatorio-lista.html`, `relatorio-estresse-login.html`) ficam nesta pasta e fazem parte das evidências. O resultado e a análise estão em `testes/testes-performance.md`.

## Observações
- Os dados de login são fictícios e pertencem ao ambiente de estudo.
- O banco de dados é em memória: as contas criadas pelo PERF-02 somem quando a aplicação é reiniciada.
