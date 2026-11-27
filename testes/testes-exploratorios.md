# Testes exploratórios: BioBanco

Sessões de teste exploratório organizadas com SBTM (Session Based Test Management). Cada sessão tem uma missão (Test Charter), duração definida de cerca de 30 minutos e um relatório preenchido durante a execução. As heurísticas usadas são as estudadas no módulo de modelagem, documentação e execução de testes da mentoria.

---

## EXP-01: Cadastro com textos incomuns

### Missão (Test Charter)
**Explore** o cadastro de pesquisador, **com** as heurísticas de testes de strings, **para descobrir** se o sistema aceita, guarda e exibe corretamente textos incomuns no campo de nome.

A missão segue o modelo de Test Charter estudado no módulo de testes da mentoria ("Explore [alvo], com [recursos], para descobrir [informações]"). As heurísticas usadas estão no grupo "Testes de strings" do mesmo módulo.

### Relatório de sessão
| Campo | Registro |
|---|---|
| **Data e hora de início** | 25 de novembro de 2026, 16h55 |
| **Nome da pessoa testadora** | Camila Penha |
| **Módulo** | Cadastro de pesquisador (e exibição do nome após o login) |
| **Tamanho da sessão** | 30 minutos (16h55 às 17h24) |
| **Heurísticas usadas** | Caracteres acentuados; Strings longas; Espaços no início ou fim; Em branco; Injeção de SQL |
| **Ambiente** | Chrome no macOS, aplicação local (http://localhost:3000), dados iniciais (aplicação reiniciada antes da sessão) |

### Notas durante a sessão
- **16h55.** Comecei a sessão. Cadastrei "Joaquim Conceição Müller" (exp1a@biobanco.test), com a heurística de **caracteres acentuados**. O cadastro foi aceito. Fiz login e o nome apareceu correto no topo, com ç, ã e ü.
- **17h00.** Usei a heurística de **strings longas**: nome "Maria" repetido 65 vezes, sem espaços (325 caracteres), conta exp1b@biobanco.test. O cadastro foi aceito, ou seja, o sistema não tem limite de tamanho para o nome. Depois do login, o nome **estourou para fora da tela**, o botão **Sair foi empurrado para fora da área visível** e apareceu **barra de rolagem horizontal**. Registrei como **BUG-06**.
- **17h10.** Heurística de **espaços no início ou fim**: nome "     Lia Souto     " (5 espaços antes e 5 depois), conta exp1c@biobanco.test. O cadastro foi aceito e, no topo, o nome apareceu como "Lia Souto", sem os espaços e no lugar certo. O sistema apara os espaços antes de guardar.
- **17h13.** Como o sistema apara os espaços, testei a heurística **em branco**: nome só com espaços, conta exp1d@biobanco.test. O cadastro foi recusado, mas com a mensagem **"Erro interno no servidor"**, em vez de uma mensagem que explique o problema. No Terminal, o log mostrou "Pesquisador validation failed" e "ValidatorError: Path `nome` is required", com o valor vazio. Os espaços foram aparados, o nome ficou vazio e o erro de validação do banco não foi tratado. Registrei como **BUG-07**. A aplicação continuou funcionando depois do erro.
- **17h24.** Heurística de **injeção de SQL**: nome "SELECT * FROM customer", conta exp1e@biobanco.test. O cadastro foi aceito e o texto apareceu no topo exatamente como digitado, tratado como um nome comum. Nenhum comportamento diferente foi observado.

### Resultado da sessão
| Heurística | Resultado |
|---|---|
| Caracteres acentuados | Sem problemas |
| Strings longas | **BUG-06**: layout quebra com nome muito longo |
| Espaços no início ou fim | Sem problemas (espaços aparados) |
| Em branco | **BUG-07**: nome só com espaços gera "Erro interno no servidor" |
| Injeção de SQL | Sem problemas (texto tratado como texto) |

### Aprendizados
- A ideia de testar o nome só com espaços surgiu do resultado anterior: ao perceber que o sistema apara os espaços, a pergunta seguinte foi o que acontece quando não sobra nada. Esse encadeamento é o que diferencia o teste exploratório de um roteiro fixo.
- O log do servidor (Terminal) ajudou a entender a causa do BUG-07 e foi anexado como evidência.
- Os dois defeitos da sessão não seriam encontrados pelos casos de teste roteirizados, que usavam apenas dados comuns no nome.

### Evidências
`EXP-01-nome-longo-1`, `EXP-01-nome-longo-2`, `EXP-01-nome-em-branco`, `EXP-01-nome-em-branco-terminal-1`, `EXP-01-nome-em-branco-terminal-2`, `EXP-01-sql`.

---

## EXP-02: Lista de solicitação e finalização com interrupções

### Missão (Test Charter)
**Explore** a lista de solicitação e a finalização, **com** as heurísticas de testes de interface (atualizar a página, botão Voltar) e de interrupções (logout e reinício do servidor), **para descobrir** se a lista, os valores e as solicitações continuam corretos e se nada é perdido ou duplicado.

A missão segue o modelo de Test Charter estudado no módulo de testes. As heurísticas usadas estão nos grupos "Testes de interface UI" (botão Voltar, que inclui verificar se transações são duplicadas, e atualizar página) e "Heurísticas gerais" (Interrupções e Siga os Dados) do mesmo módulo.

### Relatório de sessão
| Campo | Registro |
|---|---|
| **Data e hora de início** | 25 de novembro de 2026, 18h10 |
| **Nome da pessoa testadora** | Camila Penha |
| **Módulo** | Lista de solicitação e finalização |
| **Tamanho da sessão** | 34 minutos (18h10 às 18h44) |
| **Heurísticas usadas** | Atualizar página; Interrupções (logout); Botão Voltar e duplicação de transações; Interrupções (reinício do servidor); Siga os Dados |
| **Ambiente** | Chrome no macOS, aplicação local (http://localhost:3000), usuária Carla Mendes |

### Notas durante a sessão
- **18h10.** Entrei com a Carla e adicionei 1 alíquota da BIO-001 e 1 da BIO-006. Com Boleto, o resumo mostrou Subtotal R$ 130,00, Transporte R$ 45,00 e Total R$ 175,00 (a Carla não é Parceira).
- **18h13.** Heurística **atualizar página**, sem confirmar a solicitação. Continuei logada e as duas amostras continuaram na lista. A forma de pagamento voltou sozinha para PIX (opção padrão) e o resumo passou a mostrar o desconto de 10%. A tela ficou coerente, mas a escolha do usuário não foi mantida. Registrei como observação de usabilidade, não como defeito. Em um teste anterior o Chrome tinha mantido o Boleto marcado, ou seja, o comportamento depende do navegador.
- **18h18.** Heurística **interrupções (logout)**: saí com as duas amostras na lista e entrei de novo. A lista continuou com as duas amostras.
- **18h25.** Heurística de **duplicação de transações**: cliquei duas vezes, bem rápido, em "Confirmar solicitação". Apenas uma solicitação foi criada: o histórico mostrou uma única compra e o estoque baixou uma alíquota de cada amostra. Depois do primeiro clique, o botão ficou bloqueado (a lista esvazia e o botão é desativado). Com essa compra, a Carla chegou a R$ 380,00 pagos e recebeu a mensagem de que virou Parceira, com o selo no topo (**Siga os Dados**).
- **18h28.** Heurística **botão Voltar**: depois de confirmar, cliquei em Voltar no navegador. Fui para uma página em branco, fora do site. Ao avançar de novo, a lista estava vazia e o histórico continuava com uma única solicitação. Nada foi duplicado. O BioBanco funciona em uma única página (SPA), então o Voltar leva para o que estava antes na aba. Observação de usabilidade: quem usa o Voltar esperando ir para a tela anterior do sistema sai do site.
- **18h33.** Heurística **interrupções (reinício)**, parte A: com o site aberto e logado, desliguei o servidor (Control + C) e tentei adicionar uma amostra. Apareceu a mensagem **"Failed to fetch"**, técnica e em inglês, que não explica ao usuário que o servidor está fora do ar. O catálogo continuou mostrando os dados antigos. Registrei como **BUG-08**.
- **18h36.** Parte B: liguei o servidor de novo (npm start) e, **sem atualizar a página**, tentei adicionar uma amostra. Apareceu **"Amostra não encontrada"**, embora a amostra estivesse visível na tela. Ao reiniciar, os dados são recriados com novos identificadores, e a página ainda usava os antigos. Registrei como **BUG-09**.
- **18h40.** Atualizei a página. O sistema encerrou a sessão com a mensagem **"Sua sessão expirou. Faça login novamente."**, clara e em português.
- **18h44.** Entrei de novo com a Carla. Ela não era mais Parceira, o histórico estava vazio e os estoques tinham voltado ao início (BIO-001 com 10 e BIO-006 com 12). Isso acontece porque o banco de dados é em memória e volta ao estado inicial a cada reinício, comportamento descrito no README. Registrei como limitação conhecida, não como defeito.

### Resultado da sessão
| Heurística | Resultado |
|---|---|
| Atualizar página | Lista mantida; forma de pagamento volta para PIX (observação de usabilidade) |
| Interrupções (logout) | Lista mantida |
| Duplicação de transações (clique duplo) | Sem duplicação |
| Botão Voltar | Sem duplicação; Voltar sai do site (observação de usabilidade) |
| Interrupções (servidor desligado) | **BUG-08**: mensagem técnica "Failed to fetch" |
| Interrupções (servidor religado, página sem atualizar) | **BUG-09**: "Amostra não encontrada" para amostra visível |
| Interrupções (após atualizar) | Sessão encerrada com mensagem clara |
| Siga os Dados | Carla virou Parceira com R$ 380,00; após o reinício, dados voltaram ao estado inicial (limitação conhecida) |

### Aprendizados
- A lista de solicitação fica guardada no servidor, por isso sobrevive à atualização da página e ao logout; a forma de pagamento escolhida fica só na tela.
- As três mensagens da parte de reinício mostram como o tratamento de erro pode variar dentro do mesmo sistema: uma clara ("Sua sessão expirou"), uma técnica ("Failed to fetch") e uma que confunde ("Amostra não encontrada").
- O teste de clique duplo, que é uma preocupação comum em sistemas de compra, não revelou duplicação.

### Evidências
`EXP-02-antes-atualizar`, `EXP-02-depois-atualizar`, `EXP-02-sair-entrar`, `EXP-02-clique-duplo-historico`, `EXP-02-clique-duplo-estoque`, `EXP-02-voltar`, `EXP-02-servidor-desligado`, `EXP-02-servidor-religado`, `EXP-02-apos-atualizar`, `EXP-02-carla-depois`.

---

## EXP-03: Abordagem contrária na lista e na finalização

### Missão (Test Charter)
**Explore** a lista de solicitação e a finalização, **com** a heurística de sabedoria em testes "Adote abordagem contrária", **para descobrir** se o sistema impede ações que contrariam as regras de negócio e se avisa o usuário de forma clara.

A missão é bem parecida com o exemplo de Test Charter estudado no módulo de testes, que explora a funcionalidade de transferência de valores com a heurística de sabedoria em testes, usando a abordagem contrária, para descobrir se o software lida bem com ações que contrariam as regras de negócio. Aqui, a mesma ideia foi aplicada à solicitação de amostras. Na última ideia também foi usada a heurística "Manipular URL", do grupo "Testes de interface UI".

### Relatório de sessão
| Campo | Registro |
|---|---|
| **Data e hora de início** | 25 de novembro de 2026, 18h54 |
| **Nome da pessoa testadora** | Camila Penha |
| **Módulo** | Lista de solicitação, finalização e acesso à API |
| **Tamanho da sessão** | 27 minutos (18h54 às 19h21) |
| **Heurísticas usadas** | Adote abordagem contrária; Falhas agrupadas (comparação com o BUG-07); Manipular URL |
| **Ambiente** | Chrome no macOS, aplicação local (http://localhost:3000), usuária Carla Mendes |

### Notas durante a sessão
- **18h55.** Entrei com a Carla, adicionei 1 alíquota da BIO-001, escolhi Boleto (total R$ 125,00), apaguei o endereço e cliquei em "Confirmar solicitação". A compra não foi feita e o navegador mostrou o balão **"Please fill out this field."** no campo de endereço. Com isso, a mensagem que tinha aparecido uma vez no primeiro dia e não tinha sido reproduzida passou a ter causa conhecida: é a validação de campo obrigatório do navegador quando o endereço está vazio.
- **19h02.** Coloquei no endereço apenas espaços. O navegador deixou passar, mas o servidor bloqueou com a mensagem **"Informe o endereço de entrega do laboratório"**, em português. Comparando com o nome só com espaços no cadastro (BUG-07, "Erro interno no servidor"), o endereço recebe o tratamento correto. A comparação (heurística **Falhas agrupadas**) mostra onde está a diferença e indica como o BUG-07 pode ser resolvido.
- **19h07.** Na BIO-006, tentei adicionar quantidade **0**. Bloqueado, com a mensagem **"quantidade deve ser um número inteiro maior que zero"**.
- **19h08.** Quantidade **-1**: mesma mensagem, bloqueado.
- **19h09.** Quantidade decimal: o campo não aceitou a vírgula (com o navegador em inglês, só aceita ponto). Com **1.5**, mesma mensagem, bloqueado. Observações de usabilidade: um usuário brasileiro tentaria a vírgula; e a mensagem, apesar de clara, tem um tom técnico (começa com letra minúscula e fala em "número inteiro").
- **19h16.** A BIO-005 tem 1 alíquota. Adicionei 1 à lista (entrou) e tentei adicionar mais 1. O sistema bloqueou com **"Quantidade solicitada maior que as alíquotas disponíveis (1)"**, somando o que já estava na lista com o novo pedido. Observação de usabilidade: com a BIO-005 já na lista, o catálogo continua mostrando "1 alíquota disponível", porque o estoque só diminui quando a solicitação é confirmada; isso pode confundir o usuário.
- **19h19.** Heurística **Manipular URL**: em uma aba nova, sem login, abri http://localhost:3000/api/pesquisadores/me. A API respondeu **{"erro":"Token não informado. Faça login para continuar."}** e não mostrou nenhum dado.
- **19h21.** Na mesma aba, abri http://localhost:3000/api/solicitacoes. Mesma resposta, nenhum dado exposto.

### Resultado da sessão
| Ação contrária às regras | Resultado |
|---|---|
| Confirmar com endereço vazio | Bloqueado pelo navegador ("Please fill out this field.") |
| Confirmar com endereço só com espaços | Bloqueado pelo servidor, mensagem clara |
| Quantidade 0, negativa ou decimal | Bloqueado, mensagem em português (tom técnico) |
| Passar do estoque em dois pedidos | Bloqueado; o sistema soma o que já está na lista |
| Acessar a API sem login pela URL | Bloqueado; nenhum dado exposto |

Nenhum defeito novo foi encontrado nesta sessão. Foram registradas três observações de usabilidade (vírgula no campo de quantidade, tom técnico da mensagem de quantidade e estoque exibido sem considerar o que já está na lista) e foi resolvida a observação "não reproduzível" do primeiro dia.

### Aprendizados
- Uma sessão sem defeitos também é um resultado: ela mostra que as regras de negócio estão protegidas contra usos indevidos.
- Comparar campos parecidos (nome e endereço só com espaços) ajudou a entender a causa do BUG-07.
- Anotar até o que não se consegue repetir vale a pena: a mensagem do primeiro dia foi explicada nesta sessão.

### Evidências
`EXP-03-endereco-vazio`, `EXP-03-endereco-espacos`, `EXP-03-quantidade-zero`, `EXP-03-quantidade-negativa`, `EXP-03-quantidade-virgula`, `EXP-03-bio005-primeira`, `EXP-03-bio005-segunda`, `EXP-03-url-pesquisador`, `EXP-03-url-solicitacoes`.

---

## Resumo das sessões exploratórias
| Sessão | Tema | Duração | Defeitos | Observações |
|---|---|---|---|---|
| EXP-01 | Textos incomuns no cadastro (testes de strings) | 29 min | BUG-06, BUG-07 | — |
| EXP-02 | Lista e finalização com interrupções (interface UI e interrupções) | 34 min | BUG-08, BUG-09 | Pagamento volta para PIX ao atualizar; Voltar sai do site; dados voltam ao início após reinício (limitação conhecida) |
| EXP-03 | Abordagem contrária na lista e na finalização | 27 min | Nenhum | Vírgula na quantidade; tom técnico da mensagem; estoque exibido sem considerar a lista |
