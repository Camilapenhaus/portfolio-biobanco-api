# Plano de Testes: BioBanco

**Autora:** Camila Penha
**Projeto:** BioBanco, API REST e site para solicitação de amostras biológicas para pesquisa
**Contexto:** projeto de portfólio da Mentoria Júlio de Lima

## 1. Objetivo
Este plano descreve como a aplicação BioBanco será testada: o que será testado, quais técnicas foram escolhidas, como cada técnica será aplicada, quais dados serão usados e como os resultados e os defeitos serão registrados.

## 2. Sobre a aplicação
O BioBanco é uma adaptação do enunciado de e-commerce para a área de biologia. O pesquisador entra no sistema, monta uma lista de solicitação de amostras e confirma o pedido, pagando uma taxa de processamento.

Funcionalidades testadas:
- **F-LOGIN:** entrada no sistema com e-mail e senha.
- **F-CADASTRO:** criação de conta de pesquisador.
- **F-LISTA:** inclusão e remoção de amostras na lista de solicitação.
- **F-FINALIZAÇÃO:** confirmação da solicitação, com forma de pagamento e endereço de entrega.

Regras de negócio:
- **R1:** 10% de desconto na taxa paga via PIX.
- **R2:** só pode entrar na lista amostra com alíquotas disponíveis, e a quantidade total pedida não pode passar do estoque.
- **R3:** o pesquisador passa a ser **Pesquisador Parceiro** quando o total pago em taxas (subtotal menos desconto, sem transporte) chega a **R$ 300,00**. O Parceiro tem transporte refrigerado grátis nas solicitações seguintes; para os demais, o transporte custa R$ 45,00 por solicitação.

## 3. Técnicas escolhidas
Com base nos módulos de teste estudados na mentoria, foram escolhidas técnicas estruturadas para definir os casos de teste e testes exploratórios para investigar o que os roteiros não cobrem.

### 3.1 Partição de equivalência
Os valores de entrada foram divididos em grupos que devem ter o mesmo comportamento, e um representante de cada grupo foi escolhido. Isso reduz a quantidade de testes sem perder cobertura.

Aplicação no BioBanco:
- **Forma de pagamento (R1):** dois grupos, "PIX" (com desconto) e "Cartão ou Boleto" (sem desconto).
- **Disponibilidade da amostra (R2):** amostra com alíquotas (ex.: BIO-001) e amostra sem alíquotas (BIO-003).
- **E-mail no cadastro:** formato válido, sem @, sem domínio e e-mail já cadastrado.
- **Login:** dados corretos, senha errada, e-mail inexistente e campos vazios.

### 3.2 Análise do valor limite
Complementa a partição de equivalência testando as fronteiras de cada regra: um valor logo abaixo, o valor exato e um valor logo acima. Muitos defeitos acontecem nos limites, por exemplo quando a regra pede "maior ou igual" e o código usa "maior que".

Aplicação no BioBanco:
- **Limite de Parceiro (R3), maior ou igual a R$ 300,00:** a pesquisadora Carla Mendes começa com R$ 250,00 pagos. Pedindo 1 alíquota da BIO-006 (R$ 50,00) com Boleto, chega a **R$ 300,00 (no limite)** e deve virar Parceira. Pagando com PIX, paga R$ 45,00 e chega a **R$ 295,00 (abaixo)**, sem virar Parceira. Com uma amostra mais cara (BIO-004, R$ 70,00), chega a **R$ 320,00 (acima)**.
- **Quantidade × estoque (R2):** quantidade 0 (inválida), 1 (mínima), igual ao estoque e estoque + 1. A BIO-005, com apenas 1 alíquota, permite testar o limite com 1 e 2.
- **Senha do cadastro (mínimo de 6 caracteres):** senhas com 5, 6 e 7 caracteres.

### 3.3 Tabela de decisão
Usada quando duas condições juntas definem o resultado. No BioBanco, a forma de pagamento e o status de Parceiro definem, juntos, o desconto e o transporte. Exemplo com 1 alíquota da BIO-001 (taxa R$ 80,00):

| Caso | Forma de pagamento | Parceiro | Desconto | Transporte | Total esperado |
|---|---|---|---|---|---|
| 1 | PIX | Sim (Ana Souza) | R$ 8,00 | Grátis | R$ 72,00 |
| 2 | PIX | Não (Bruno Lima) | R$ 8,00 | R$ 45,00 | R$ 117,00 |
| 3 | Cartão ou Boleto | Sim (Ana Souza) | R$ 0,00 | Grátis | R$ 80,00 |
| 4 | Cartão ou Boleto | Não (Bruno Lima) | R$ 0,00 | R$ 45,00 | R$ 125,00 |

### 3.4 Testes exploratórios com SBTM e heurísticas
Além dos casos de teste roteirizados, serão feitas sessões de teste exploratório organizadas com SBTM (Session Based Test Management). Cada sessão tem:
- uma **missão (Test Charter)** no formato "Explore [alvo], com [recursos ou heurística], para descobrir [informação]";
- **duração de 30 minutos**, sem interrupções;
- um **relatório de sessão** preenchido durante a execução, com o que foi feito, observado e aprendido.

Heurísticas previstas:
- **Testes de strings** no cadastro: nome muito longo, acentos, espaços no início e no fim, caracteres especiais e comando SQL.
- **Testes de interface:** botão Voltar, atualizar a página e manipular a URL.
- **Interrupções:** sair do sistema no meio de uma solicitação e reiniciar a aplicação (o banco é em memória).
- **Siga os Dados:** conferir se o estoque diminui depois da solicitação e se ela aparece no histórico.
- **Abordagem contrária:** tentar o que o sistema não deveria permitir, como finalizar com a lista vazia ou sem endereço.

## 4. Condições de teste e prioridades
Antes dos casos de teste, foram levantadas as condições de teste em alto nível, com prioridade definida pelo risco e pela importância para o negócio.

| # | Condição de teste | Rastreabilidade | Técnica | Prioridade |
|---|---|---|---|---|
| C01 | Limite de R$ 300,00 para virar Parceiro | R3 | Valor limite | Alta |
| C02 | Desconto PIX só com PIX e só sobre a taxa | R1 | Partição de equivalência | Alta |
| C03 | Quantidade pedida em relação ao estoque | R2 | Valor limite | Alta |
| C04 | Amostra sem alíquotas não entra na lista | R2 | Partição de equivalência | Alta |
| C05 | Forma de pagamento × Parceiro (desconto e transporte) | R1, R3 | Tabela de decisão | Média |
| C06 | Senha do cadastro com 5, 6 e 7 caracteres | F-CADASTRO | Valor limite | Média |
| C07 | E-mail do cadastro válido, inválido e já existente | F-CADASTRO | Partição de equivalência | Média |
| C08 | Login com dados inválidos | F-LOGIN | Partição de equivalência | Média |
| C09 | Estoque e histórico depois da solicitação | F-FINALIZAÇÃO, R2 | Heurística Siga os Dados | Média |
| C10 | Campos de texto com dados incomuns | F-CADASTRO | Heurísticas de strings | Baixa |
| C11 | Voltar, atualizar, sair e reiniciar | Todas | Heurísticas de interface e Interrupções | Baixa |
| C12 | Ações que o sistema não deveria permitir | Todas | Abordagem contrária | Baixa |

## 5. Casos de teste
Cada caso de teste segue o modelo: **ID, Título, Prioridade, Rastreabilidade, Pré-condições, Passos, Resultado esperado (para cada passo) e Pós-condições**, de forma que outra pessoa consiga executar sem precisar interpretar. Os casos de teste são identificados como **CT-xx** e ficam registrados no documento de casos de teste.

## 6. Execução
- Cada execução recebe um status: **Em progresso, Sucesso, Falha ou Bloqueado**. "Bloqueado" é usado quando algo externo impede o teste (por exemplo, a aplicação fora do ar), e não é o mesmo que falha.
- Cada execução tem evidência (captura de tela com as informações relevantes).
- Antes de registrar um defeito, o comportamento é reproduzido para confirmar.
- Como o banco de dados é em memória, a aplicação é reiniciada antes dos testes que dependem dos dados iniciais.

## 7. Reporte de defeitos
Cada defeito é registrado com: **resumo, descrição, passos para reproduzir, resultado esperado, resultado atual, prioridade e severidade.**
- **Prioridade:** urgência da correção.
- **Severidade:** impacto do defeito e se ainda é possível continuar usando ou testando o sistema.

Neste projeto, os defeitos ficam registrados, sem correção. Se fossem corrigidos, o passo seguinte seria o **reteste** (confirmar a correção) e a **regressão** (verificar se a mudança não quebrou o que já funcionava).

## 8. Dados de teste

| Pesquisador | E-mail | Parceiro | Total pago em taxas |
|---|---|---|---|
| Ana Souza | ana.souza@biobanco.test | Sim | R$ 350,00 |
| Bruno Lima | bruno.lima@biobanco.test | Não | R$ 0,00 |
| Carla Mendes | carla.mendes@biobanco.test | Não | R$ 250,00 |

Senha de todos: `123456`. Todos os dados são fictícios.

| Amostra | Taxa por alíquota | Alíquotas |
|---|---|---|
| BIO-001 Sangue total humano | R$ 80,00 | 10 |
| BIO-002 DNA de Arabidopsis | R$ 120,00 | 5 |
| BIO-003 E. coli K-12 | R$ 60,00 | 0 |
| BIO-004 Soro humano | R$ 70,00 | 8 |
| BIO-005 RNA de peixe-zebra | R$ 150,00 | 1 |
| BIO-006 Levedura S288C | R$ 50,00 | 12 |

## 9. Ambiente
- MacBook Air, macOS, navegador Google Chrome.
- Aplicação local: site em http://localhost:3000 e documentação da API (Swagger) em http://localhost:3000/api-docs.
- Banco de dados em memória (mongodb-memory-server): os dados voltam ao estado inicial sempre que a aplicação é reiniciada.

## 10. Testes de API (manuais)
Além dos testes pelo site, a API foi testada diretamente pela documentação Swagger, sem passar pela tela. O objetivo foi confirmar que as regras de negócio estão protegidas também no servidor e testar situações que o site não permite (por exemplo, forma de pagamento inexistente). Foram usadas as mesmas técnicas dos casos de teste, conferindo também o código de status HTTP de cada resposta. Os testes são identificados como **API-xx** e ficam no documento de testes de API.

## 11. Testes de performance
Com base no módulo de testes de performance, foram feitos testes de carga e de estresse com a ferramenta **k6** nos fluxos de login e de lista de solicitação, com os critérios de aceitação: menos de 1% de falhas e 95% das respostas em menos de 500 ms. Os testes são identificados como **PERF-xx** e ficam no documento de testes de performance, junto com o ambiente utilizado e a análise dos resultados.

## 12. Testes automatizados
Foram automatizados testes na API e no site, sempre a partir de cenários que já tinham sido executados manualmente, para que possam ser repetidos de forma rápida e igual:

- **API:** Mocha, Chai e Supertest. 5 testes: login válido, senha errada, desconto do PIX (R1), amostra sem alíquotas (R2) e a Carla virando Parceira ao chegar a R$ 300,00 (R3, o mesmo cenário do CT-01).
- **Web:** Cypress. 3 testes: login válido, senha errada e o fluxo completo do CT-01 pelo site.

Os testes automatizados ficam na pasta `testes/automacao`, separada do código da aplicação, e estão descritos no documento de testes automatizados.

## 13. Fora do escopo
- **Cobertura de código e testes de unidade:** não serão medidos neste projeto; o foco da automação está nos testes de API e de web.
- **Correção dos defeitos:** os defeitos encontrados foram apenas registrados.
- **Jira e Zephyr:** não foram usados; a rastreabilidade fica no campo próprio de cada caso de teste, ligando o teste à regra de negócio ou à funcionalidade.

## 14. Testes complementares
Também foram feitos testes de acessibilidade (ferramentas axe DevTools e Lighthouse, navegação só por teclado, zoom de 200%, leitor de tela VoiceOver e contraste manual), registrados como ACE-01 a ACE-14. Eles mostraram, na prática, a diferença entre **checking** (verificações automáticas por regras, como as das ferramentas) e **testing** (investigação humana): os problemas de foco do teclado e de contraste nos botões em degradê só apareceram nos testes manuais.
