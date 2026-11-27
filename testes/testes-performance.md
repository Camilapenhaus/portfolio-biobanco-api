# Testes de performance: BioBanco

Com base no módulo de testes de performance estudado na mentoria, foram feitos testes com a ferramenta **k6** em dois fluxos da API do BioBanco: o **login** e a **lista de solicitação** (adicionar e remover uma amostra). A missão é bem parecida com o exemplo estudado no módulo: medir o tempo de resposta com vários usuários ao mesmo tempo e conferir se ele fica dentro de um limite combinado.

**Pergunta que os testes respondem:** *com vários pesquisadores usando ao mesmo tempo, a API responde rápido e sem erros?*

- **Data:** 26 de novembro de 2026
- **Testadora:** Camila Penha
- **Ferramenta:** k6 v2.3.0 (darwin/amd64)
- **Scripts:** pasta `testes/performance` (ver o README da pasta)

## 1. Ambiente

Os testes foram executados no meu computador pessoal, com a aplicação e o k6 rodando **na mesma máquina**:

| Item | Configuração |
|---|---|
| Computador | MacBook Air (Retina, 13", 2019) |
| Processador | Intel Core i5 dual-core, 1,6 GHz |
| Memória | 8 GB LPDDR3 |
| Sistema | macOS Sonoma 14.8.9 |
| Aplicação | BioBanco local (`npm start`, http://localhost:3000), banco em memória |

Como a aplicação e o k6 dividem o mesmo processador, os números são **indicativos deste ambiente**. Em um servidor real, os tempos tendem a ser outros. O que vale aqui é a **comparação** entre os fluxos e entre as cargas.

## 2. Critérios de aceitação (thresholds)

Os mesmos critérios foram usados em todos os testes, como no exemplo estudado no módulo:

| Critério | Limite | Significado |
|---|---|---|
| `http_req_failed` | menor que 1% | quase nenhuma requisição pode falhar |
| `http_req_duration` p(95) | menor que 500 ms | 95% das respostas precisam chegar em menos de meio segundo |

Além dos thresholds, cada requisição tem **checks** (verificações), por exemplo: status 200, token recebido e pesquisadora correta.

## 3. Cenários

| ID | Fluxo | Carga | Tipo |
|---|---|---|---|
| PERF-01 | Login (`POST /api/auth/login`) | 10 usuários virtuais, 50 iterações | Carga |
| PERF-02 | Lista: adicionar e remover a BIO-006 | 10 usuários virtuais, 30 segundos | Carga |
| PERF-03 | Login | 20 usuários virtuais, 100 iterações | Estresse (o dobro do PERF-01) |

**Escolhas de projeto:**
- **Uma amostra representativa (BIO-006, levedura):** pela **partição de equivalência**, todas as amostras com estoque se comportam da mesma forma na lista, então uma representa o grupo.
- **Adicionar e remover, sem confirmar a solicitação:** confirmar mudaria o estoque e o total gasto da pesquisadora a cada repetição. Remover o item deixa a lista igual ao início, e o teste pode repetir milhares de vezes sem alterar os dados.
- **Usuários próprios para o teste:** no PERF-02, a preparação (`setup`) cadastra 10 pesquisadores de teste, um para cada usuário virtual, para que um não mexa na lista do outro.
- **Separação com tag:** as requisições do fluxo da lista receberam a tag `fluxo:lista`, para que os cadastros e logins da preparação não entrem na medição.

## 4. Resultados

| ID | p(95) | Média | Máximo | Falhas | Checks | Vazão | Resultado |
|---|---|---|---|---|---|---|---|
| PERF-01 | 482,82 ms | 249,68 ms | 662 ms | 0% (0 de 50) | 150 de 150 | 16,7 req/s | **Passou** (perto do limite) |
| PERF-02 | 27,2 ms | 13,9 ms | 193,8 ms | 0% (0 de 1.830) | 3.660 de 3.660 | 58,8 req/s | **Passou** |
| PERF-03 | 1,51 s | 653 ms | 2,9 s | 0% (0 de 100) | 300 de 300 | 19,1 req/s | **Não passou** no tempo |

O PERF-03 foi executado uma segunda vez, para gerar o relatório HTML, e confirmou o resultado: **p(95) de 1,06 s**, 0% de falhas e 300 de 300 checks. Em performance é normal os números variarem um pouco entre execuções. Nas duas, o p(95) ficou **mais que o dobro** do limite.

No PERF-03, o k6 encerrou com a mensagem `thresholds on metrics 'http_req_duration' have been crossed`, que indica que o critério de tempo não foi atendido.

## 5. Análise

**O login é o ponto mais sensível.** No PERF-01, ele passou, mas com o p(95) a apenas 17 ms do limite.

**A lista é cerca de 17 vezes mais rápida que o login** (média de 14 ms contra 250 ms). Isso mostra que a lentidão não é da API como um todo, mas do momento da verificação da senha.

**No estresse, o login chegou ao limite desta máquina.** Ao dobrar os usuários (de 10 para 20):

| | PERF-01 (10 usuários) | PERF-03 (20 usuários) | Variação |
|---|---|---|---|
| Vazão | 16,7 logins/s | 19,1 logins/s | +14% |
| Tempo médio | 250 ms | 653 ms | 2,6 vezes maior |
| p(95) | 483 ms | 1,51 s | 3,1 vezes maior |

O número de logins atendidos por segundo quase não aumentou, mas o tempo de espera triplicou. Os pedidos extras ficam **em fila**. Mesmo assim, **nenhuma requisição falhou**: o sistema fica mais lento, mas não quebra.

**Causa provável:** a senha é protegida com um cálculo propositalmente pesado (hash), que é bom para a segurança, mas usa bastante processador. É uma troca entre **segurança e performance**.

## 6. Risco registrado

Este resultado foi registrado como **risco**, e não como bug, porque não há um requisito de desempenho definido para a aplicação. Como estudado na mentoria, o papel do QA é **alertar quanto a riscos** e apresentar os números. A decisão sobre o que fazer é do time.

> **Risco:** com 20 ou mais pesquisadores fazendo login ao mesmo tempo, o tempo de resposta do login passa de 1 segundo neste ambiente. Sugestão: repetir o teste em um ambiente parecido com o de produção antes de definir se é necessário otimizar.

## 7. Evidências

- **Prints do resumo no terminal:** `testes/evidencias/performance/` (PERF-01, PERF-02 e PERF-03).
- **Relatórios HTML do k6:** `relatorio-login.html`, `relatorio-lista.html` e `relatorio-estresse-login.html`, na pasta `testes/performance`. Os relatórios do login e do estresse são de uma segunda execução, feita para gerá-los.

**Observação sobre os relatórios:** nos testes curtos (3 a 6 segundos), o relatório HTML não era gravado, porque o painel do k6 junta os dados a cada 10 segundos e o teste terminava antes. A solução foi usar `K6_WEB_DASHBOARD_PERIOD=1s`. O comando completo está no README da pasta.
