# Testes manuais da API: BioBanco

Testes feitos diretamente na API REST do BioBanco, pela interface do Swagger (http://localhost:3000/api-docs), sem passar pelo site. O objetivo foi confirmar que as regras de negócio estão protegidas no servidor, e não só na tela, e testar situações que o site não permite (por exemplo, formas de pagamento inexistentes ou amostras sem estoque).

As técnicas são as mesmas usadas nos casos de teste do site, estudadas no módulo de testes da mentoria: caminho feliz, análise do valor limite, partição de equivalência e heurísticas ("Siga os Dados", "Em branco"). Nos testes negativos, foi conferido também o **código de status HTTP** de cada resposta.

- **Data:** 26 de novembro de 2026
- **Testadora:** Camila Penha
- **Ambiente:** Chrome no macOS, aplicação local, Swagger UI
- **Usuária:** Carla Mendes (carla.mendes@biobanco.test / 123456), com dados iniciais (aplicação reiniciada antes dos testes)

## Códigos de status observados
| Código | Significado | Onde apareceu |
|---|---|---|
| 200 | Sucesso | API-01, 02, 03, 05, 07 |
| 201 | Sucesso, com algo novo criado | API-04, 06 |
| 400 | Pedido com dado inválido | API-08, 10, 11 |
| 401 | Não autorizado (token ausente, inválido ou expirado) | API-02 (token inválido) e EXP-03 (sem token) |
| 422 | Pedido válido, mas a regra de negócio não permite | API-09 |
| 500 | Erro interno do servidor | API-12 (**BUG-07**) |

---

## Parte 1: fluxo completo de solicitação pela API (caminho feliz)
Este fluxo repete, pela API, o CT-01 feito no site: a Carla (R$ 250,00 pagos) pede 1 alíquota da BIO-006 (R$ 50,00) com Boleto e chega exatamente ao limite de R$ 300,00 para virar Parceira (**análise do valor limite**, regra R3). Antes e depois da compra, os dados da Carla foram consultados para acompanhar o valor de `totalGasto` (heurística **Siga os Dados**).

| ID | Pedido | Dados enviados | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|
| API-01 | `POST /api/auth/login` | e-mail e senha da Carla | 200, token e dados da Carla (parceiro false, totalGasto 250) | Conforme esperado | Sucesso |
| API-02 | `GET /api/pesquisadores/me` | token da Carla | 200, parceiro false, totalGasto 250 | Conforme esperado | Sucesso |
| API-03 | `GET /api/amostras` | — | 200, 6 amostras, cada uma com seu id | Conforme esperado; id da BIO-006 usado no passo seguinte | Sucesso |
| API-04 | `POST /api/lista/itens` | id da BIO-006, quantidade 1 | 201, levedura na lista, subtotal 50 | Conforme esperado | Sucesso |
| API-05 | `GET /api/lista/resumo?formaPagamento=boleto` | parâmetro de consulta | 200; subtotal 50, desconto 0, transporte 45, total 95, transporteGratis false | Conforme esperado | Sucesso |
| API-06 | `POST /api/solicitacoes` | formaPagamento boleto e endereço | 201; mensagem de confirmação informando que virou Pesquisadora Parceira; parceiro true, totalGasto 300 | Conforme esperado | Sucesso |
| API-07 | `GET /api/pesquisadores/me` | token da Carla | 200, parceiro true, totalGasto 300 | Conforme esperado | Sucesso |

**Antes e depois (Siga os Dados):**

| Campo | API-02 (antes) | API-07 (depois) |
|---|---|---|
| parceiro | false | **true** |
| totalGasto | 250 | **300** |

O site e a API calcularam os mesmos valores (R$ 95,00 de total, com R$ 45,00 de transporte) e aplicaram a regra do Parceiro da mesma forma, o que mostra que as regras estão implementadas no servidor.

**Observação sobre o token (API-02):** na primeira tentativa, o `GET /api/pesquisadores/me` retornou **401** com "Token inválido ou expirado", porque o token colado no botão Authorize não era o token real da resposta. A área "Responses" do Swagger mostra um token de exemplo que também começa com "eyJ…" e pode ser confundido com o verdadeiro. Depois de copiar o token da área "Server response", o pedido retornou 200. O resultado confirma que a API recusa tokens inválidos. O token vale por 2 horas, e a API usa a mesma mensagem para token inválido e expirado.

---

## Parte 2: testes negativos que o site não permite
No site, várias entradas inválidas são barradas pelo navegador ou pelos botões antes de chegarem ao servidor. Pela API, o pedido chega direto ao servidor. Estes testes verificam se o servidor se protege sozinho.

| ID | Pedido | Dado enviado | Técnica | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| API-08 | `POST /api/solicitacoes` | formaPagamento "dinheiro" | Partição de equivalência (grupo inválido da regra R1) | 400, forma de pagamento recusada | 400: "formaPagamento deve ser uma destas: pix, cartao, boleto" | Sucesso |
| API-09 | `POST /api/lista/itens` | id da BIO-003 (0 alíquotas), quantidade 1 | Partição de equivalência (grupo "sem alíquotas" da regra R2) | 422, amostra sem estoque recusada | 422: "Amostra sem alíquotas disponíveis no momento" | Sucesso |
| API-10 | `POST /api/auth/cadastro` | senha "12345" (5 caracteres) | Análise do valor limite (abaixo do mínimo) | 400, senha recusada | 400: "A senha deve ter pelo menos 6 caracteres" | Sucesso |
| API-11 | `POST /api/auth/cadastro` | e-mail "diego.sene.biobanco.test" | Partição de equivalência (e-mail inválido) | 400, e-mail recusado | 400: "E-mail em formato inválido" | Sucesso |
| API-12 | `POST /api/auth/cadastro` | nome só com espaços | Heurística "Em branco" | 400 com mensagem de validação | **500: "Erro interno no servidor"** | Falha (**BUG-07**) |

**Comparação site × API:**

| Situação | No site | Na API |
|---|---|---|
| Pagamento com forma inexistente | Impossível (só há 3 opções) | Recusado pelo servidor (400) |
| Amostra sem alíquotas | Botão desativado | Recusado pelo servidor (422) |
| Senha com 5 caracteres | Barrado pelo navegador, aviso em inglês | Recusado pelo servidor, mensagem em português (400) |
| E-mail sem @ | Barrado pelo navegador, aviso em inglês | Recusado pelo servidor, mensagem em português (400) |
| Nome só com espaços | "Erro interno no servidor" | "Erro interno no servidor" (500) |

As regras de negócio e as validações estão protegidas no servidor, inclusive quando o site é ignorado. A API já possui mensagens em português para senha curta e e-mail inválido; no site, essas mensagens não chegam a aparecer porque o navegador barra antes, com avisos em inglês. O único defeito encontrado foi o BUG-07, agora confirmado no servidor: no API-12 o Swagger marcou a resposta 500 como "Undocumented", porque ela não está prevista na especificação da API, e o Terminal registrou o mesmo erro de validação visto na sessão exploratória EXP-01.

## Evidências
`API-01-login-carla`, `API-02-token-invalido`, `API-02-token-valido`, `API-03-catalogo`, `API-04-adicionar-levedura`, `API-05-resumo-boleto`, `API-06-confirmar-solicitacao-1`, `API-06-confirmar-solicitacao-2`, `API-07-me-carla-depois`, `API-08-pagamento-dinheiro`, `API-09-bio003-sem-aliquotas`, `API-10-senha-curta-1`, `API-10-senha-curta-2`, `API-11-email-invalido`, `API-12-nome-espacos`, `API-12-nome-espacos-terminal`.

Observação de boa prática: algumas telas do Swagger mostram o token de acesso no bloco "Curl". Como a aplicação é local, os dados são fictícios e o token expira em 2 horas, não há risco; em evidências públicas, o ideal é ocultar tokens.
