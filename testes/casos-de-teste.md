# Casos de teste: BioBanco

Casos de teste criados com as técnicas descritas no plano de testes. Status possíveis: Em progresso, Sucesso, Falha e Bloqueado.

## Regra R3: limite de R$ 300,00 para Pesquisador Parceiro (análise do valor limite)
A análise do valor limite foi usada na regra do Pesquisador Parceiro porque defeitos costumam aparecer nas fronteiras. Por isso foram testados valores abaixo, exatamente no limite e acima de R$ 300,00.

| Caso | Ponto testado | Total pago em taxas | Esperado | Status |
|---|---|---|---|---|
| CT-02 | Abaixo do limite | R$ 295,00 | Não vira Parceira | Sucesso |
| CT-01 | Exatamente no limite | R$ 300,00 | Vira Parceira | Sucesso |
| CT-03 | Acima do limite | R$ 360,00 | Vira Parceiro | Sucesso |

---

### CT-01: Pesquisadora vira Parceira ao atingir exatamente R$ 300,00 pagos em taxas
| Campo | Conteúdo |
|---|---|
| **ID** | CT-01 |
| **Título** | Pesquisadora vira Parceira ao atingir exatamente R$ 300,00 pagos em taxas |
| **Prioridade** | Alta |
| **Rastreabilidade** | R3 (Pesquisador Parceiro); condição C01 |
| **Técnica** | Análise do valor limite (ponto no limite) |
| **Pré-condições** | Aplicação reiniciada (dados iniciais). Carla Mendes não é Parceira e tem R$ 250,00 pagos. BIO-006 com 12 alíquotas. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Entrar com carla.mendes@biobanco.test / 123456 | Catálogo aparece, sem o selo PARCEIRO | Conforme esperado |
| 2 | Adicionar 1 alíquota da BIO-006 (R$ 50,00) | Levedura aparece na lista | Conforme esperado |
| 3 | Escolher Boleto | Subtotal R$ 50,00; Desconto R$ 0,00; Transporte R$ 45,00; Total R$ 95,00 | Conforme esperado |
| 4 | Preencher o endereço e confirmar | Mensagem de solicitação confirmada informando que agora é Pesquisadora Parceira | "Solicitação confirmada! Você agora é Pesquisador Parceiro e terá transporte grátis nas próximas solicitações." |
| 5 | Olhar o topo da página | Selo PARCEIRO aparece | Conforme esperado |
| 6 | Adicionar uma amostra e olhar o resumo, sem confirmar | Transporte "Grátis (Parceiro)" | Conforme esperado |

- **Pós-condições:** Carla Mendes passa a ser Parceira, com R$ 300,00 pagos; BIO-006 fica com 11 alíquotas. A lista do passo 6 foi esvaziada sem confirmar.
- **Status:** Sucesso.
- **Evidências:** `CT-01-passo1` (passo 1), `CT-01-passo2` (passos 2 e 3), `CT-01-passo4` (passos 4 e 5: mensagem e selo), `CT-01-passo6` (passo 6).
- **Data:** 24/11/2026.
- **Observação:** na primeira tentativa, a forma de pagamento PIX foi selecionada por engano no passo 4. Essa execução foi aproveitada como CT-02 (abaixo do limite), e o CT-01 foi repetido depois de reiniciar a aplicação.

---

### CT-02: Pesquisadora não vira Parceira abaixo do limite (R$ 295,00)
| Campo | Conteúdo |
|---|---|
| **ID** | CT-02 |
| **Título** | Pesquisadora não vira Parceira quando o total pago fica abaixo de R$ 300,00 |
| **Prioridade** | Alta |
| **Rastreabilidade** | R3 (Pesquisador Parceiro) e R1 (desconto PIX); condições C01 e C02 |
| **Técnica** | Análise do valor limite (ponto abaixo do limite) |
| **Pré-condições** | Aplicação reiniciada. Carla Mendes não é Parceira e tem R$ 250,00 pagos. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Entrar com carla.mendes@biobanco.test / 123456 | Catálogo aparece, sem o selo PARCEIRO | Conforme esperado |
| 2 | Adicionar 1 alíquota da BIO-006 (R$ 50,00) | Levedura aparece na lista | Conforme esperado |
| 3 | Escolher PIX | Subtotal R$ 50,00; Desconto R$ 5,00 (10%); Transporte R$ 45,00; Total R$ 90,00 | Desconto de R$ 5,00 aplicado |
| 4 | Confirmar a solicitação | Mensagem só de solicitação confirmada, sem virar Parceira (R$ 250,00 + R$ 45,00 = R$ 295,00) | "Solicitação confirmada!", sem mensagem de Parceira |
| 5 | Olhar o topo da página | Selo PARCEIRO não aparece | Conforme esperado |

- **Pós-condições:** Carla Mendes continua não Parceira, com R$ 295,00 pagos.
- **Status:** Sucesso.
- **Evidências:** `CT-02-sem-selo` (passo 5).
- **Data:** 24/11/2026.
- **Observação:** este caso também confirmou a regra R1: o desconto de 10% foi aplicado só sobre a taxa (R$ 5,00 sobre R$ 50,00), e o valor que conta para a parceria é o valor já com desconto.

---

### CT-03: Pesquisador vira Parceiro acima do limite (R$ 360,00)
| Campo | Conteúdo |
|---|---|
| **ID** | CT-03 |
| **Título** | Pesquisador vira Parceiro quando o total pago passa de R$ 300,00 |
| **Prioridade** | Alta |
| **Rastreabilidade** | R3 (Pesquisador Parceiro); condição C01 |
| **Técnica** | Análise do valor limite (ponto acima do limite) |
| **Pré-condições** | Bruno Lima não é Parceiro e tem R$ 0,00 pagos. BIO-002 com 5 alíquotas. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Entrar com bruno.lima@biobanco.test / 123456 | Catálogo aparece, sem o selo PARCEIRO | Conforme esperado |
| 2 | Adicionar 3 alíquotas da BIO-002 (R$ 120,00 cada) | Lista mostra 3x DNA genômico de Arabidopsis thaliana, R$ 360,00 | Conforme esperado |
| 3 | Escolher Boleto | Subtotal R$ 360,00; Desconto R$ 0,00; Transporte R$ 45,00; Total R$ 405,00 | Conforme esperado (Total R$ 405,00) |
| 4 | Preencher o endereço e confirmar | Mensagem de solicitação confirmada informando que agora é Pesquisador Parceiro | Conforme esperado |
| 5 | Olhar o topo da página | Selo PARCEIRO aparece | Conforme esperado |

- **Pós-condições:** Bruno Lima passa a ser Parceiro, com R$ 360,00 pagos; BIO-002 fica com 2 alíquotas.
- **Status:** Sucesso.
- **Evidências:** `CT-03-passo1`, `CT-03-passo2`, `CT-03-passo3`, `CT-03-passo4` (mensagem e selo).
- **Data:** 24/11/2026.
- **Observação:** o teste foi feito com o Bruno, sem reiniciar a aplicação, porque depois do CT-01 a Carla já era Parceira.

## Conclusão da regra R3
Os três pontos da fronteira tiveram o comportamento esperado: abaixo do limite (R$ 295,00) a pesquisadora não virou Parceira; exatamente no limite (R$ 300,00) e acima dele (R$ 360,00), virou. Isso indica que a regra está implementada como "maior ou igual a R$ 300,00", conforme a especificação. Também foi confirmado que o transporte grátis vale a partir da solicitação seguinte.

## Regra R1: desconto de 10% no PIX (partição de equivalência)
A partição de equivalência foi escolhida para a regra do desconto PIX porque as formas de pagamento se dividem em grupos com o mesmo comportamento (com desconto e sem desconto). Assim, um representante de cada grupo é suficiente, o que reduz a quantidade de testes sem perder cobertura.

| Grupo | Valores do grupo | Comportamento esperado | Representante | Caso |
|---|---|---|---|---|
| Com desconto | PIX | 10% de desconto sobre a taxa | PIX | CT-04 (e CT-02) |
| Sem desconto | Cartão, Boleto | Sem desconto | Cartão | CT-05 |
| Inválido | Forma de pagamento inexistente | Solicitação recusada | "dinheiro", via API | A executar na exploração da API |

---

### CT-04: Desconto de 10% aplicado sobre a taxa no pagamento via PIX
| Campo | Conteúdo |
|---|---|
| **ID** | CT-04 |
| **Título** | Desconto de 10% aplicado sobre a taxa no pagamento via PIX |
| **Prioridade** | Alta |
| **Rastreabilidade** | R1 (desconto PIX); condição C02 |
| **Técnica** | Partição de equivalência (grupo "com desconto") |
| **Pré-condições** | Ana Souza é Parceira (transporte grátis). BIO-001 com alíquotas disponíveis. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Entrar com ana.souza@biobanco.test / 123456 | Catálogo aparece, com o selo PARCEIRO | Conforme esperado |
| 2 | Adicionar 1 alíquota da BIO-001 (R$ 80,00) | Lista mostra 1x Sangue total humano (EDTA), R$ 80,00 | Conforme esperado |
| 3 | Escolher PIX | Subtotal R$ 80,00; Desconto R$ 8,00; Transporte Grátis (Parceiro); Total R$ 72,00 | Conforme esperado |
| 4 | Preencher o endereço e confirmar | Mensagem "Solicitação confirmada!" | Conforme esperado |
| 5 | Conferir o histórico de solicitações | Nova solicitação com Sangue total humano (EDTA), PIX, total R$ 72,00 | Conforme esperado |

- **Pós-condições:** Ana Souza continua Parceira, com R$ 422,00 pagos (R$ 350,00 + R$ 72,00); BIO-001 fica com uma alíquota a menos.
- **Status:** Sucesso.
- **Evidências:** `CT-04-passo1`, `CT-04-passo3`, `CT-04-passo4`, `CT-04-passo5`.
- **Data:** 24/11/2026.
- **Observação:** junto com o CT-02 (R$ 5,00 de desconto sobre R$ 50,00), o desconto foi conferido com dois valores diferentes, sempre 10% e só sobre a taxa. O valor gravado no histórico foi o mesmo exibido antes da confirmação.

---

### CT-05: Pagamento com Cartão não recebe desconto
| Campo | Conteúdo |
|---|---|
| **ID** | CT-05 |
| **Título** | Pagamento com Cartão não recebe o desconto PIX |
| **Prioridade** | Alta |
| **Rastreabilidade** | R1 (desconto PIX); condição C02 |
| **Técnica** | Partição de equivalência (grupo "sem desconto", representado pelo Cartão) |
| **Pré-condições** | Ana Souza é Parceira (transporte grátis). BIO-004 com alíquotas disponíveis. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Adicionar 1 alíquota da BIO-004 (R$ 70,00) | Lista mostra 1x Soro humano, R$ 70,00 | Conforme esperado |
| 2 | Escolher Cartão | Subtotal R$ 70,00; Desconto R$ 0,00; Transporte Grátis (Parceiro); Total R$ 70,00 | Conforme esperado |
| 3 | Preencher o endereço e confirmar | Mensagem "Solicitação confirmada!" | Conforme esperado |
| 4 | Conferir o histórico de solicitações | Nova solicitação com Soro humano (BIO-004), Cartão, total R$ 70,00 | Conforme esperado |

- **Pós-condições:** Ana Souza continua Parceira, com R$ 492,00 pagos; BIO-004 fica com uma alíquota a menos.
- **Status:** Sucesso.
- **Evidências:** `CT-05-passo2`, `CT-05-passo4`.
- **Data:** 24/11/2026.
- **Observação:** como Cartão e Boleto pertencem ao mesmo grupo, o Boleto não precisou de um caso próprio; ele também já apareceu sem desconto nos casos CT-01 e CT-03.

## Conclusão da regra R1
Os dois grupos válidos tiveram o comportamento esperado: o PIX recebeu 10% de desconto sobre a taxa (CT-02 e CT-04), e o Cartão não recebeu desconto (CT-05). O grupo inválido (forma de pagamento inexistente) será testado pela API, já que o site só oferece as três opções válidas.

## Regra R2: só amostra com alíquotas, sem passar do estoque (valor limite e partição de equivalência)
A regra de estoque foi testada com análise do valor limite (quantidade igual ao estoque e uma unidade acima) e com partição de equivalência (amostra com alíquotas e amostra sem alíquotas). A BIO-005, que tem apenas 1 alíquota, permite testar o limite com poucos passos.

---

### CT-06: Pedido acima do estoque é recusado
| Campo | Conteúdo |
|---|---|
| **ID** | CT-06 |
| **Título** | Sistema recusa quantidade maior que as alíquotas disponíveis |
| **Prioridade** | Alta |
| **Rastreabilidade** | R2 (estoque); condição C03 |
| **Técnica** | Análise do valor limite (uma unidade acima do estoque); teste negativo |
| **Pré-condições** | Ana Souza logada, lista vazia. BIO-005 com 1 alíquota. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Conferir o estoque da BIO-005 | 1 alíquota disponível | Conforme esperado |
| 2 | Digitar 2 na quantidade da BIO-005 | Campo aceita o número | Conforme esperado |
| 3 | Clicar em "Adicionar à lista" | Mensagem de erro informando que a quantidade é maior que as alíquotas disponíveis (1) | Mensagem de erro exibida no topo informando que o pedido ultrapassa o estoque, que é de 1 alíquota |
| 4 | Olhar a lista de solicitação | Lista continua vazia | "Nenhuma amostra na lista." |

- **Pós-condições:** nenhuma alteração; BIO-005 continua com 1 alíquota.
- **Status:** Sucesso.
- **Evidências:** `CT-06-passo3`, `CT-06-passo4`.
- **Data:** 24/11/2026.

---

### CT-07: Pedido igual ao estoque é aceito e a amostra passa a "Sem alíquotas disponíveis"
| Campo | Conteúdo |
|---|---|
| **ID** | CT-07 |
| **Título** | Sistema aceita quantidade igual às alíquotas disponíveis e, após a solicitação, a amostra passa a aparecer como "Sem alíquotas disponíveis" |
| **Prioridade** | Alta |
| **Rastreabilidade** | R2 (estoque); condições C03 e C09 |
| **Técnica** | Análise do valor limite (quantidade igual ao estoque) e heurística Siga os Dados |
| **Pré-condições** | Ana Souza logada, lista vazia. BIO-005 com 1 alíquota. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Adicionar 1 alíquota da BIO-005 | RNA entra na lista: 1x RNA total de peixe-zebra, R$ 150,00 | Conforme esperado |
| 2 | Escolher a forma de pagamento e confirmar | "Solicitação confirmada!" | Conforme esperado; a solicitação também apareceu no histórico |
| 3 | Olhar a BIO-005 no catálogo | "Sem alíquotas disponíveis" e botão "Adicionar à lista" desativado | Conforme esperado |

- **Pós-condições:** a BIO-005 passa a aparecer como "Sem alíquotas disponíveis" e se comporta como amostra esgotada.
- **Status:** Sucesso.
- **Evidências:** `CT-07-passo1`, `CT-07-passo3`.
- **Data:** 24/11/2026.
- **Observação:** com o CT-06, a fronteira do estoque foi testada nos dois lados: 2 alíquotas (acima) foi recusado e 1 alíquota (igual ao estoque) foi aceito. Depois da solicitação, a tela passou a mostrar "Sem alíquotas disponíveis" para a BIO-005, indicando que o estoque foi atualizado corretamente.

---

### CT-08: Amostra sem alíquotas não pode ser adicionada à lista
| Campo | Conteúdo |
|---|---|
| **ID** | CT-08 |
| **Título** | Amostra sem alíquotas disponíveis não pode ser adicionada à lista |
| **Prioridade** | Alta |
| **Rastreabilidade** | R2 (estoque); condição C04 |
| **Técnica** | Partição de equivalência (grupo "sem alíquotas", representado pela BIO-003) |
| **Pré-condições** | Ana Souza logada. BIO-003 com 0 alíquotas. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Olhar a BIO-003 | "Sem alíquotas disponíveis" | Conforme esperado |
| 2 | Tentar digitar no campo de quantidade | Campo desativado | Conforme esperado; o campo fica cinza com o valor 1 e não permite edição |
| 3 | Tentar clicar em "Adicionar à lista" | Botão desativado, nada acontece | Conforme esperado; o cursor muda para o símbolo de "não permitido" |
| 4 | Olhar a lista de solicitação | E. coli não aparece na lista | Conforme esperado |

- **Pós-condições:** nenhuma alteração.
- **Status:** Sucesso.
- **Evidência:** `CT-08`.
- **Data:** 24/11/2026.
- **Observação:** o campo de quantidade desativado continua mostrando o número 1, mesmo sem alíquotas. Não impede o uso, mas pode passar a impressão de que há 1 unidade; fica registrado como ponto de melhoria de usabilidade, não como defeito.

## Conclusão da regra R2
A regra de estoque teve o comportamento esperado nos três cenários: pedido acima do estoque recusado (CT-06), pedido igual ao estoque aceito, com a amostra passando a "Sem alíquotas disponíveis" depois da solicitação (CT-07) e amostra sem alíquotas bloqueada na tela (CT-08). A tentativa de adicionar amostra sem alíquotas diretamente pela API será feita na exploração da API.

## Cadastro: tamanho mínimo da senha (análise do valor limite)
O cadastro exige senha com no mínimo 6 caracteres. Foram testados os valores 5 (abaixo), 6 (no limite) e 7 (acima).

---

### CT-09: Cadastro recusado com senha de 5 caracteres
| Campo | Conteúdo |
|---|---|
| **ID** | CT-09 |
| **Título** | Cadastro não é concluído com senha abaixo do mínimo (5 caracteres) |
| **Prioridade** | Média |
| **Rastreabilidade** | F-CADASTRO; condição C06 |
| **Técnica** | Análise do valor limite (abaixo do mínimo); teste negativo |
| **Pré-condições** | Nenhum usuário logado; aba Cadastrar aberta. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Preencher Nome "Diego Sene", Instituição "Laboratório Teste", E-mail "diego.senha5@biobanco.test" | Campos aceitam os dados | Conforme esperado |
| 2 | Preencher a senha "12345" (5 caracteres) | Campo aceita | Conforme esperado |
| 3 | Clicar em "Criar conta" | Conta não é criada; aviso de que a senha precisa de pelo menos 6 caracteres | Conta não criada; aviso do navegador: "Please lengthen this text to 6 characters or more (you are currently using 5 characters)." |

- **Pós-condições:** nenhuma conta criada.
- **Status:** Sucesso.
- **Evidência:** `CT-09`.
- **Data:** 24/11/2026.
- **Observação:** o bloqueio é feito pela validação do próprio navegador (atributo `minlength="6"` no campo), por isso o aviso aparece no idioma do navegador (inglês), enquanto o restante do site está em português. Fica registrado como ponto de melhoria de usabilidade, assim como a mensagem "Please fill out this field." observada antes no campo de endereço. A validação da senha no servidor será verificada na exploração da API.

---

### CT-10: Cadastro aceito com senha de exatamente 6 caracteres
| Campo | Conteúdo |
|---|---|
| **ID** | CT-10 |
| **Título** | Cadastro é concluído com senha no limite mínimo (6 caracteres) |
| **Prioridade** | Média |
| **Rastreabilidade** | F-CADASTRO; condição C06 |
| **Técnica** | Análise do valor limite (exatamente no mínimo) |
| **Pré-condições** | Nenhum usuário logado; aba Cadastrar aberta; e-mail diego.senha6@biobanco.test ainda não cadastrado. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Preencher Nome "Diego Sene", Instituição "Laboratório Teste", E-mail "diego.senha6@biobanco.test" | Campos aceitam os dados | Conforme esperado |
| 2 | Preencher a senha "123456" (6 caracteres) | Campo aceita | Conforme esperado |
| 3 | Clicar em "Criar conta" | Conta criada; mensagem "Cadastro realizado! Agora é só entrar com sua senha."; site volta para a aba Entrar com o e-mail preenchido | Conforme esperado |

- **Pós-condições:** conta diego.senha6@biobanco.test criada (fica só na memória até a aplicação ser reiniciada).
- **Status:** Sucesso.
- **Evidência:** `CT-10`.
- **Data:** 24/11/2026.

## Cadastro: e-mail (partição de equivalência)
Os e-mails do cadastro foram divididos em grupos: e-mail novo em formato válido (aceito), e-mail já cadastrado (recusado) e e-mail em formato inválido (recusado).

---

### CT-11: Cadastro recusado com e-mail já existente
| Campo | Conteúdo |
|---|---|
| **ID** | CT-11 |
| **Título** | Sistema impede o cadastro de um e-mail que já está em uso |
| **Prioridade** | Média |
| **Rastreabilidade** | F-CADASTRO; condição C07 |
| **Técnica** | Partição de equivalência (grupo "e-mail já cadastrado"); heurística "Nome já existente"; teste negativo |
| **Pré-condições** | Conta diego.senha6@biobanco.test já criada (CT-10). |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Abrir a aba Cadastrar e preencher os mesmos dados do CT-10 (e-mail diego.senha6@biobanco.test) | Campos aceitam os dados | Conforme esperado |
| 2 | Clicar em "Criar conta" | Conta não é criada; mensagem "Já existe um pesquisador com este e-mail" | Conta não criada; mensagem informando que o e-mail já existe |

- **Pós-condições:** continua existindo uma única conta com esse e-mail.
- **Status:** Sucesso.
- **Evidência:** `CT-11`.
- **Data:** 24/11/2026.
- **Observação:** caso executado por iniciativa própria logo depois do CT-10, aproveitando a conta recém-criada.

---

### CT-12: Cadastro aceito com senha de 7 caracteres
| Campo | Conteúdo |
|---|---|
| **ID** | CT-12 |
| **Título** | Cadastro é concluído com senha acima do mínimo (7 caracteres) |
| **Prioridade** | Média |
| **Rastreabilidade** | F-CADASTRO; condição C06 |
| **Técnica** | Análise do valor limite (acima do mínimo) |
| **Pré-condições** | Janela anônima do Chrome; nenhum usuário logado; aba Cadastrar aberta. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Preencher Nome "Diego Anônimo", Instituição "Laboratório Teste", E-mail "diego.anonimo@biobanco.test" | Campos aceitam os dados | Conforme esperado |
| 2 | Preencher a senha "1234567" (7 caracteres) | Campo aceita | Conforme esperado |
| 3 | Clicar em "Criar conta" | Conta criada; mensagem "Cadastro realizado! Agora é só entrar com sua senha." | Conforme esperado |

- **Pós-condições:** conta diego.anonimo@biobanco.test criada.
- **Status:** Sucesso.
- **Evidência:** `CT-12`.
- **Data:** 24/11/2026.
- **Observação:** executado em janela anônima, junto com a investigação de preenchimento automático descrita abaixo.

## Conclusão do tamanho da senha
Os três pontos tiveram o comportamento esperado: 5 caracteres foi recusado (CT-09), 6 caracteres (no limite) e 7 caracteres foram aceitos (CT-10 e CT-12).

---

## Investigação: campos de e-mail e senha preenchidos depois de atualizar a página
- **Data:** 24/11/2026.
- **O que foi observado:** depois de criar a conta do Diego (CT-10), ao atualizar a página, os campos de e-mail e senha continuavam preenchidos com os dados dele, tanto na aba Entrar quanto na aba Cadastrar (nome e instituição ficavam vazios). Clicando em Entrar, o acesso era feito com a conta do Diego.
- **Hipótese:** o preenchimento era feito pelo gerenciador de senhas do Chrome, e não pelo BioBanco. Indícios: o código do site não preenche o campo de senha em nenhum momento, e a barra de endereço mostrava o ícone de chave (senhas salvas para o site).
- **Como foi verificado:** o mesmo fluxo foi repetido em uma janela anônima, que não usa senhas salvas nem preenchimento automático: cadastro de uma conta nova (CT-12) e, em seguida, atualização da página.
- **Resultado:** na janela anônima, os campos ficaram vazios depois de atualizar.
- **Conclusão:** o preenchimento vinha do Chrome; não é um defeito do BioBanco. Continuar logada depois de atualizar a página também é o comportamento esperado (a sessão fica guardada na aba até o usuário sair ou fechar a aba).
- **Ponto de melhoria (opcional):** os campos de senha poderiam usar o atributo `autocomplete` adequado (por exemplo, `new-password` no cadastro), para orientar melhor o navegador.
- **Evidência:** `INVESTIGACAO-autopreenchimento`.

---

### CT-13: Cadastro recusado com e-mail sem @
| Campo | Conteúdo |
|---|---|
| **ID** | CT-13 |
| **Título** | Cadastro não é concluído com e-mail em formato inválido (sem @) |
| **Prioridade** | Média |
| **Rastreabilidade** | F-CADASTRO; condição C07 |
| **Técnica** | Partição de equivalência (grupo "e-mail em formato inválido"); teste negativo |
| **Pré-condições** | Nenhum usuário logado; aba Cadastrar aberta. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Preencher Nome "Diego Sene", Instituição "Laboratório Teste", E-mail "diego.sene.biobanco.test", Senha "123456" | Campos aceitam a digitação | Conforme esperado |
| 2 | Clicar em "Criar conta" | Conta não é criada; aviso de que falta o @ | Conta não criada; aviso do navegador: "Please include an '@' in the email address. 'diego.sene.biobanco.test' is missing an '@'." |

- **Pós-condições:** nenhuma conta criada.
- **Status:** Sucesso.
- **Evidência:** `CT-13`.
- **Data:** 24/11/2026.
- **Observação:** assim como no CT-09, o bloqueio é feito pela validação do navegador (campo do tipo e-mail), e o aviso aparece em inglês. A validação de formato de e-mail no servidor será verificada na exploração da API.

## Conclusão dos e-mails no cadastro
Os três grupos tiveram o comportamento esperado: e-mail novo e válido aceito (CT-10), e-mail já cadastrado recusado (CT-11) e e-mail sem @ recusado (CT-13).

## Login com dados inválidos (partição de equivalência)
As tentativas de login foram divididas em grupos: dados corretos (aceito, já exercitado em todos os casos anteriores), e-mail existente com senha errada, e-mail inexistente e e-mail com domínio antigo. Os grupos inválidos devem ser recusados com a mesma mensagem genérica, sem revelar qual dado está errado.

---

### CT-14: Login recusado com senha errada
| Campo | Conteúdo |
|---|---|
| **ID** | CT-14 |
| **Título** | Login não é realizado com e-mail existente e senha errada |
| **Prioridade** | Média |
| **Rastreabilidade** | F-LOGIN; condição C08 |
| **Técnica** | Partição de equivalência (grupo "e-mail existente + senha errada"); teste negativo |
| **Pré-condições** | Nenhum usuário logado; aba Entrar aberta; campos vazios. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Preencher E-mail "ana.souza@biobanco.test" e Senha "654321" | Campos aceitam a digitação | Conforme esperado |
| 2 | Clicar em "Entrar" | Login não realizado; mensagem "E-mail ou senha inválidos" | Conforme esperado |

- **Pós-condições:** nenhum usuário logado.
- **Status:** Sucesso.
- **Evidência:** `CT-14`.
- **Data:** 24/11/2026.

---

### CT-15: Login recusado com e-mail inexistente
| Campo | Conteúdo |
|---|---|
| **ID** | CT-15 |
| **Título** | Login não é realizado com e-mail que não existe no sistema, com a mesma mensagem da senha errada |
| **Prioridade** | Média |
| **Rastreabilidade** | F-LOGIN; condição C08 |
| **Técnica** | Partição de equivalência (grupo "e-mail inexistente"); heurística "Nome inexistente"; teste negativo |
| **Pré-condições** | Nenhum usuário logado; aba Entrar aberta; campos vazios. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Preencher E-mail "fantasma@biobanco.test" e Senha "123456" | Campos aceitam a digitação | Conforme esperado |
| 2 | Clicar em "Entrar" | Login não realizado; a mesma mensagem do CT-14, "E-mail ou senha inválidos" | Conforme esperado |

- **Pós-condições:** nenhum usuário logado.
- **Status:** Sucesso.
- **Evidência:** `CT-15`.
- **Data:** 24/11/2026.
- **Observação:** a mensagem é idêntica à do CT-14, o que é uma boa prática de segurança: o sistema não revela se o e-mail existe ou não.

---

### CT-16: Login recusado com o e-mail de domínio antigo (.com)
| Campo | Conteúdo |
|---|---|
| **ID** | CT-16 |
| **Título** | Login não é realizado com e-mail parecido com um cadastrado, mas com outro domínio |
| **Prioridade** | Média |
| **Rastreabilidade** | F-LOGIN; condição C08 |
| **Técnica** | Partição de equivalência (grupo "e-mail parecido, mas diferente do cadastrado"); teste negativo |
| **Pré-condições** | Nenhum usuário logado; aba Entrar aberta; campos vazios. Conta ana.souza@biobanco.test existe. |

| # | Passo | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Preencher E-mail "ana.souza@biobanco.com" e a senha correta da Ana, "123456" | Campos aceitam a digitação | Conforme esperado |
| 2 | Clicar em "Entrar" | Login não realizado; mensagem "E-mail ou senha inválidos" | Conforme esperado |

- **Pós-condições:** nenhum usuário logado.
- **Status:** Sucesso.
- **Evidência:** `CT-16`.
- **Data:** 24/11/2026.
- **Observação:** a ideia deste caso surgiu em 23/11/2026, quando o navegador preencheu automaticamente o e-mail antigo da usuária de teste e o sistema recusou o acesso. O caso confirma que o e-mail precisa ser exatamente igual ao cadastrado.

## Conclusão do login
Os três grupos inválidos foram recusados com a mesma mensagem genérica, "E-mail ou senha inválidos" (CT-14, CT-15 e CT-16), sem revelar se o erro está no e-mail ou na senha. O login com dados corretos foi exercitado em todos os casos anteriores.

---

## Tabela de decisão: forma de pagamento × Parceiro (condição C05)
A tabela de decisão foi usada porque o resultado do resumo depende de duas condições juntas: a forma de pagamento define o desconto e o status de Parceiro define o transporte. As quatro combinações foram cobertas pelos casos executados:

| Forma de pagamento | Parceiro | Desconto | Transporte | Caso que cobriu | Status |
|---|---|---|---|---|---|
| PIX | Não (Carla) | 10% sobre a taxa | R$ 45,00 | CT-02 | Sucesso |
| Boleto | Não (Carla) | Sem desconto | R$ 45,00 | CT-01 | Sucesso |
| PIX | Sim (Ana) | 10% sobre a taxa | Grátis | CT-04 | Sucesso |
| Cartão | Sim (Ana) | Sem desconto | Grátis | CT-05 | Sucesso |

---

## Resumo da execução
| Bloco | Casos | Técnica principal | Resultado |
|---|---|---|---|
| R3: Pesquisador Parceiro | CT-01, CT-02, CT-03 | Análise do valor limite | 3 sucessos |
| R1: desconto PIX | CT-04, CT-05 (e CT-02) | Partição de equivalência | 2 sucessos |
| R2: estoque | CT-06, CT-07, CT-08 | Valor limite e partição de equivalência | 3 sucessos |
| Cadastro: senha | CT-09, CT-10, CT-12 | Análise do valor limite | 3 sucessos |
| Cadastro: e-mail | CT-11, CT-13 (e CT-10) | Partição de equivalência | 2 sucessos |
| Login | CT-14, CT-15, CT-16 | Partição de equivalência | 3 sucessos |
| Pagamento × Parceiro | coberta por CT-01, 02, 04, 05 | Tabela de decisão | 4 combinações conferidas |

**Total:** 16 casos de teste executados no site, 16 com status Sucesso. Uma investigação (preenchimento automático) concluiu que o comportamento vinha do navegador e não era defeito. Foram registrados três pontos de melhoria de usabilidade: avisos de validação do navegador em inglês (CT-09 e CT-13), campo de quantidade desativado mostrando "1" em amostra sem alíquotas (CT-08) e sugestão de atributo `autocomplete` nos campos de senha.

**Ficam para a exploração da API:** forma de pagamento inexistente, adicionar amostra sem alíquotas direto pela API, senha curta e e-mail inválido enviados direto ao servidor (sem a validação do navegador).
