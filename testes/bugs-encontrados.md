# BioBanco: bugs encontrados

Lista de defeitos encontrados durante o uso e os testes da aplicação, para registrar formalmente na fase de testes. Decisão geral: os bugs ficam registrados, sem correção. Cada bug tem **severidade** (impacto do defeito no uso do sistema) e **prioridade** (urgência da correção).

| Bug | Resumo | Severidade | Prioridade |
|---|---|---|---|
| BUG-01 | Transporte cobrado com a lista vazia (não Parceiros) | Baixa | Baixa |
| BUG-02 | Contraste insuficiente nas abas ativas (modo claro) | Média | Média |
| BUG-03 | Área de toque pequena nas opções de pagamento | Baixa | Baixa |
| BUG-04 | Foco do teclado pouco visível | Média | Média |
| BUG-05 | Contraste insuficiente nos botões em degradê | Média | Alta |
| BUG-06 | Layout do topo quebra com nome muito longo | Média | Baixa |
| BUG-07 | Nome só com espaços gera "Erro interno no servidor" | Baixa | Média |
| BUG-08 | Mensagem técnica "Failed to fetch" com o servidor fora do ar | Baixa | Baixa |
| BUG-09 | "Amostra não encontrada" após reinício do servidor sem atualizar a página | Baixa | Baixa |

## BUG-01: transporte cobrado com a lista de solicitação vazia
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Severidade:** Baixa. Não há cobrança real (o botão de confirmar fica desativado e a API recusa lista vazia); é um problema de exibição que pode confundir o usuário.
- **Prioridade:** Baixa. Só aparece com a lista vazia e para quem não é Parceiro.
- **Onde:** site, painel "Finalizar solicitação" (resumo de valores). Origem: `GET /api/lista/resumo`.
- **Como reproduzir:** entrar com um pesquisador que não é Parceiro (ex.: carla.mendes@biobanco.test / 123456 ou bruno.lima@biobanco.test / 123456) sem nenhuma amostra na lista.
- **Resultado atual:** o resumo mostra Subtotal R$ 0,00, Transporte refrigerado R$ 45,00 e Total R$ 45,00.
- **Resultado esperado:** com a lista vazia, transporte e total deveriam ser R$ 0,00 (não há o que transportar).
- **Impacto:** baixo. O botão "Confirmar solicitação" fica desativado e a API recusa finalizar lista vazia (400), então não há cobrança real; é um problema de exibição/confusão para o usuário.
- **Em quem aparece:**
  - Carla Mendes (não Parceira): **aparece** (Transporte R$ 45,00, Total R$ 45,00 com lista vazia).
  - Bruno Lima (não Parceiro): **aparece** (confirmado).
  - Ana Souza (Parceira): **não aparece** (Subtotal R$ 0,00, Transporte "Grátis (Parceiro)", Total R$ 0,00; selo PARCEIRO no topo).
  - **Conclusão:** o bug acontece só com pesquisadores que **não** são Parceiros.
  - **Confirmação extra (24/11/2026, durante o CT-01):** com a Carla ainda não Parceira, a lista vazia mostrava transporte de R$ 45,00; logo depois de ela virar Parceira, a mesma lista vazia passou a mostrar "Grátis (Parceiro)".
- **Evidências:** fotos da tela da Carla e do Bruno (com o bug) e da Ana (sem o bug), tiradas em 23/11/2026. Para o relatório formal, refazer como capturas de tela (Command + Shift + 4).
- **Encontrado em:** 23/11/2026, ao conferir o site depois da atualização com 6 amostras. (Na época os e-mails eram @biobanco.com; hoje são @biobanco.test.)

## BUG-02 (acessibilidade): contraste insuficiente nas abas ativas "Entrar" e "Cadastrar"
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Severidade:** Média. O texto da aba ativa continua legível, mas com esforço para pessoas com baixa visão (gravidade "Serious" no axe).
- **Prioridade:** Média. Afeta a primeira tela do sistema e a correção é simples (trocar uma cor).
- **Ferramentas:** axe DevTools (axe-core 4.13.0), varredura da página inteira, regra WCAG 2.1 AA. **Confirmado também pelo Lighthouse** (ACE-08, nota 96, 1 falha de contraste).
- **Causa:** o estilo de **aba ativa** (`.aba.ativa`) usa texto turquesa #1e9fb0 sobre fundo branco no **modo claro**. Por isso, a aba que estiver selecionada (Entrar ou Cadastrar) fica com contraste baixo.
- **Ocorrências:**
  1. **Aba "Entrar"** (página de entrada, aba de login selecionada): `<button class="aba ativa" data-aba="login" data-testid="aba-login">Entrar</button>`. Encontrado em 24/11/2026 às 17:25 (ACE-02).
  2. **Aba "Cadastrar"** (página de entrada, aba de cadastro selecionada): `<button class="aba ativa" data-aba="cadastro" data-testid="aba-cadastro">Cadastrar</button>`. Encontrado em 24/11/2026 às 17:34 (ACE-04). Confirmado com o botão **Highlight** do axe (Role: button; Accessible Text: Cadastrar).
  - Ambos dentro de `<section class="cartao acesso" data-testid="caixa-acesso">`.
- **Como reproduzir:** abrir http://localhost:3000 no modo claro, selecionar a aba (Entrar ou Cadastrar), abrir o DevTools (botão direito > Inspect, ou Command + Option + I), aba axe DevTools, rodar a varredura da página inteira.
- **Resultado atual:** contraste de **3.16:1** (texto turquesa #1e9fb0 sobre fundo branco #ffffff, fonte 12pt / 16px, peso normal).
- **Resultado esperado:** contraste mínimo de **4.5:1** para texto normal.
- **Regra violada:** WCAG 2 nível AA, critério **1.4.3 (Contraste mínimo)**. Tags do axe: cat.color, wcag2aa, wcag143.
- **Impacto (axe):** **Serious** (grave).
- **Não acontece no modo escuro:** a varredura da página de entrada no modo escuro deu 0 problemas (ACE-03).
- **Quem é afetado:** pessoas com baixa visão, daltonismo, ou usando a tela sob muita luz.
- **Sugestão de correção:** escurecer o turquesa do texto da aba ativa no modo claro (ex.: #0b6f7c, que passa de 4.5:1 sobre branco), mantendo o turquesa claro só nas bordas e linhas, que não são texto. Como as duas ocorrências têm a mesma causa (`.aba.ativa`), uma única correção resolve as duas.
- **Evidências:** fotos da tela do axe DevTools com o detalhe do problema nas duas abas, e do Lighthouse com a falha de contraste (24/11/2026).
- **Observação de QA:** a segunda ocorrência foi registrada no mesmo bug, e não como bug novo, para evitar bug duplicado (mesma causa, mesma correção).

## BUG-03 (acessibilidade): botões de escolha da forma de pagamento com área de toque pequena
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Severidade:** Baixa. Clicar no texto ao lado também seleciona a opção, o que reduz o impacto.
- **Prioridade:** Baixa. Afeta principalmente o uso no celular.
- **Ferramenta:** Lighthouse (aba do DevTools), modo **Snapshot**, Device **Desktop**, categoria **Accessibility** (ACE-09). **O axe DevTools não apontou** esse problema, porque estava configurado na regra WCAG 2.1, e a verificação de tamanho de área de toque é da WCAG 2.2.
- **Onde:** catálogo de amostras (depois do login), painel **Finalizar solicitação**, campo **Pagamento da taxa**: os 3 botões redondos de escolha (**radio buttons**) PIX, Cartão e Boleto.
  - Elementos: `form#form-finalizar > fieldset > label.opcao > input`
    - `<input type="radio" name="pagamento" value="pix" checked data-testid="pagamento-pix">`
    - `<input type="radio" name="pagamento" value="cartao" data-testid="pagamento-cartao">`
    - `<input type="radio" name="pagamento" value="boleto" data-testid="pagamento-boleto">`
- **Como reproduzir:** entrar no sistema (ex.: ana.souza@biobanco.test / 123456), modo claro; DevTools > Lighthouse; Mode **Snapshot**, Device Desktop, só Accessibility; "Analyze the page"; abrir o item "Touch targets do not have sufficient size or spacing".
- **Resultado atual:** 25 de 26 verificações aprovadas; falha "Touch targets do not have sufficient size or spacing" (áreas de toque sem tamanho ou espaçamento suficiente), na seção Best Practices, apontando os 3 radio buttons de pagamento, que são pequenos e ficam muito próximos uns dos outros.
- **Resultado esperado:** cada área de toque com pelo menos **24 × 24 pixels**, ou com espaço suficiente em volta para não encostar na área vizinha.
- **Regra relacionada:** WCAG 2.2, critério **2.5.8 (Tamanho mínimo da área de toque)**, nível AA.
- **Quem é afetado:** quem usa o celular (toque com o dedo), pessoas com tremor nas mãos ou dificuldade motora; risco de escolher a forma de pagamento errada.
- **Atenuante:** clicar no texto ao lado do botão (ex.: "PIX (10% de desconto)") também seleciona a opção, porque o botão está dentro do rótulo (`label`). Isso reduz o impacto, mas o círculo em si continua pequeno e as opções continuam muito próximas.
- **Impacto estimado:** moderado.
- **Sugestão de correção:** aumentar o tamanho dos radio buttons e o espaçamento entre as opções (ex.: mais altura em cada linha de opção).
- **Evidências:** fotos da tela do Lighthouse com o resultado 25/26 e com a lista dos elementos que falharam (24/11/2026).
- **Encontrado em:** 24/11/2026 às 17:57, por Camila, com o Lighthouse.

## BUG-04 (acessibilidade): foco do teclado pouco visível (modo claro e modo escuro)
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Severidade:** Média. A navegação por teclado funciona, mas quem depende dela se perde com facilidade.
- **Prioridade:** Média. Afeta todos os elementos clicáveis, e a correção é um único estilo de foco.
- **Como foi encontrado:** teste manual, navegação só pelo teclado (ACE-10 no modo claro e ACE-11 no modo escuro). Nenhuma ferramenta automática (axe, Lighthouse) apontou, porque elas não avaliam se o contorno de foco é fácil de enxergar.
- **Onde:** página de entrada e catálogo, **nos dois modos de cor**, ao andar com a tecla **Tab** pelos botões, abas, campos e opções de pagamento.
- **Como reproduzir:** abrir http://localhost:3000, sem usar o mouse; apertar **Tab** repetidas vezes e acompanhar qual elemento está selecionado; entrar (ex.: carla.mendes@biobanco.test / 123456) e continuar até "Confirmar solicitação". Repetir nos modos claro e escuro.
- **Resultado atual:** o contorno que mostra onde o teclado está é **suave e pouco destacado** nos dois modos; é preciso prestar muita atenção para saber qual elemento está selecionado. Confuso para quem tem dificuldade de visão ou de atenção.
- **Resultado esperado:** um contorno de foco forte e fácil de ver em todos os elementos clicáveis (linha mais grossa, com bom contraste contra o fundo e contra o próprio botão).
- **Causa provável (análise do código):** o CSS só define estilo de foco para a chavinha de tema (contorno de 3px) e para os campos de texto (contorno turquesa de 2px). Os demais botões (abas, "Adicionar à lista", "Confirmar solicitação", "Sair") e as opções de pagamento usam o **contorno padrão do navegador**, que fica fraco sobre o fundo e sobre os botões em degradê.
- **Regras relacionadas:** WCAG 2.4.7 (Foco visível, nível AA); WCAG 2.2 2.4.13 (Aparência do foco, nível AAA); 1.4.11 (Contraste de elementos não textuais, 3:1).
- **Quem é afetado:** quem navega só pelo teclado (pessoas com dificuldade motora, pessoas com visão parcial, usuários avançados).
- **Impacto estimado:** moderado. A navegação funciona, mas a pessoa se perde com facilidade.
- **Sugestão de correção:** um estilo de foco único para todos os elementos clicáveis (ex.: `:focus-visible { outline: 3px solid <cor forte>; outline-offset: 3px; }`), com a cor ajustada para cada modo.
- **Evidências:** foto da tela no modo escuro com o campo de quantidade da amostra BIO-002 em foco (24/11/2026, 18:14).
- **Encontrado em:** 24/11/2026, por Camila, no teste manual só com teclado.

## BUG-05 (acessibilidade): contraste insuficiente do texto branco nos botões em degradê
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Severidade:** Média. O texto dos botões continua legível para a maioria, mas fica difícil para pessoas com baixa visão, principalmente na ponta turquesa (2.16:1).
- **Prioridade:** Alta. Afeta os botões das ações principais do sistema (Entrar, Criar conta, Adicionar à lista, Confirmar solicitação), e a correção é simples.
- **Como foi encontrado:** teste manual de contraste (ACE-14) com o **WebAIM Contrast Checker** (https://webaim.org/resources/contrastchecker/). O axe e o Lighthouse **não apontaram**, porque não conseguem medir contraste de texto sobre fundo em degradê.
- **Onde:** todos os botões principais (classe `.btn`), **nos dois modos** (o degradê é o mesmo no claro e no escuro):
  - "Entrar" (`data-testid="btn-entrar"`) e "Criar conta" (`btn-cadastrar`), na página de entrada;
  - "Adicionar à lista" (`adicionar-BIO-00X`), nos cartões do catálogo;
  - "Confirmar solicitação" (`btn-finalizar`), no painel Finalizar solicitação.
- **Causa:** texto branco #FFFFFF sobre o degradê `linear-gradient(90deg, #1e7fc2, #2ec4b6)` (variável `--botao` em `public/css/style.css`). O texto tem 16px com peso 600 (semi-negrito), o que para a WCAG é **texto normal** (exige 4.5:1).
- **Como reproduzir:** no WebAIM Contrast Checker, Foreground `FFFFFF` e Background `1E7FC2` (ponta azul); depois Background `2EC4B6` (ponta turquesa).
- **Resultado atual:**

| Ponta do degradê | Contraste | Texto normal AA | Texto normal AAA | Texto grande AA | Texto grande AAA |
|---|---|---|---|---|---|
| Azul #1E7FC2 | **4.31:1** | ❌ Fail | ❌ Fail | ✅ Pass | ❌ Fail |
| Turquesa #2EC4B6 | **2.16:1** | ❌ Fail | ❌ Fail | ❌ Fail | ❌ Fail |

- **Resultado esperado:** pelo menos **4.5:1** em todo o fundo do botão (texto normal, WCAG AA).
- **Regra violada:** WCAG 2 nível AA, critério **1.4.3 (Contraste mínimo)**.
- **Análise:** a ponta azul fica **perto** do mínimo (4.31, faltando pouco para 4.5); a ponta turquesa fica **muito abaixo** (2.16, menos da metade do exigido). As letras do lado direito do botão são as mais difíceis de ler.
- **Diferente do BUG-02:** o BUG-02 é texto turquesa sobre fundo branco nas abas, só no modo claro; o BUG-05 é texto branco sobre o degradê dos botões, nos dois modos. Causas e correções diferentes, por isso é um bug separado (não é duplicado).
- **Quem é afetado:** pessoas com baixa visão, daltonismo, ou usando a tela sob muita luz; são justamente os botões das ações mais importantes do site.
- **Impacto estimado:** sério (mesma regra e mesmo nível do BUG-02, e afeta os botões principais).
- **Sugestão de correção:** escurecer o degradê (ex.: tons do `--botao-hover`, #0b4f7c → #1e9fb0, que ficam mais escuros) ou usar texto escuro sobre o turquesa; conferir de novo as duas pontas no WebAIM.
- **Evidências:** três fotos do WebAIM Contrast Checker: resultados 4.31:1 e 2.16:1, e a parte de baixo da página com o turquesa também falhando em "Graphical Objects and User Interface Components" (24/11/2026, 18:46 a 18:47). Essa terceira linha (critério 1.4.11, mínimo 3:1) vale para ícones, bordas e contornos, não para texto; fica só como informação extra, a regra que conta para o BUG-05 é a de texto normal.
- **Encontrado em:** 24/11/2026, por Camila, no teste manual de contraste.

## BUG-06: layout do topo quebra com nome muito longo
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Resumo:** um nome muito longo, sem espaços, estoura para fora da tela no topo e empurra o botão Sair para fora da área visível.
- **Severidade:** média. O sistema continua funcionando, mas o usuário precisa rolar a página para os lados para encontrar o botão Sair.
- **Prioridade:** baixa. Só acontece com nomes fora do comum, e a correção pode ser planejada sem urgência.
- **Como foi encontrado:** sessão exploratória EXP-01, heurística "Strings longas".
- **Como reproduzir:**
  1. Na aba Cadastrar, preencher o nome com "Maria" repetido 65 vezes, sem espaços (325 caracteres); instituição "Laboratório Teste"; e-mail exp1b@biobanco.test; senha 123456.
  2. Clicar em "Criar conta".
  3. Entrar com o e-mail e a senha cadastrados.
  4. Olhar o topo da página.
- **Resultado esperado:** o nome é limitado no cadastro (por exemplo, no máximo 100 caracteres) ou exibido de forma que caiba na tela (por exemplo, cortado com "…"), mantendo o botão Sair visível e sem rolagem horizontal.
- **Resultado atual:** o cadastro é aceito sem limite de tamanho; no topo, o nome estoura para fora da tela, o botão Sair fica fora da área visível e aparece barra de rolagem horizontal.
- **Evidências:** `EXP-01-nome-longo-1` (topo) e `EXP-01-nome-longo-2` (página rolada, botão Sair deslocado).
- **Encontrado em:** 25/11/2026, 17h00, por Camila Penha.

## BUG-07: nome só com espaços gera "Erro interno no servidor"
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Resumo:** ao cadastrar um nome formado só por espaços, o sistema recusa o cadastro com a mensagem genérica "Erro interno no servidor", em vez de uma mensagem de validação.
- **Severidade:** baixa. O cadastro inválido é corretamente impedido e a aplicação continua funcionando; o problema é a mensagem, que não orienta o usuário e passa a impressão de que o sistema falhou.
- **Prioridade:** média. A mensagem de erro do servidor é ruim para a imagem do sistema e a correção é simples.
- **Como foi encontrado:** sessão exploratória EXP-01, heurística "Em branco", logo depois de observar que o sistema apara os espaços do nome.
- **Como reproduzir:**
  1. Na aba Cadastrar, preencher o nome só com espaços (por exemplo, 5 espaços); instituição "Laboratório Teste"; e-mail exp1d@biobanco.test; senha 123456.
  2. Clicar em "Criar conta".
- **Resultado esperado:** cadastro recusado com uma mensagem de validação clara, como "Informe o nome" (status 400), no mesmo padrão das outras validações do cadastro.
- **Resultado atual:** cadastro recusado com a mensagem "Erro interno no servidor" (status 500).
- **Análise (log do servidor):** o Terminal registrou "Pesquisador validation failed" e "ValidatorError: Path `nome` is required", com valor vazio. O nome com espaços passa pela verificação de campo obrigatório, os espaços são aparados ao salvar, o nome fica vazio e o erro de validação do banco de dados não é tratado, virando um erro 500.
- **Evidências:** `EXP-01-nome-em-branco` (tela), `EXP-01-nome-em-branco-terminal-1` e `EXP-01-nome-em-branco-terminal-2` (log do servidor).
- **Confirmação pela API (26/11/2026, teste API-12):** o mesmo cadastro enviado direto pelo Swagger (`POST /api/auth/cadastro`, nome "     ") retornou **status 500** com {"erro": "Erro interno no servidor"}, e o Terminal registrou o mesmo `ValidatorError`. Isso confirma que o defeito está no servidor, e não na tela. O Swagger marcou a resposta 500 como "Undocumented", porque ela não está prevista na especificação da API. Evidências: `API-12-nome-espacos` e `API-12-nome-espacos-terminal`.
- **Encontrado em:** 25/11/2026, 17h13, por Camila Penha.

## BUG-08: mensagem técnica "Failed to fetch" quando o servidor está fora do ar
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Resumo:** com o servidor fora do ar, qualquer ação no site mostra a mensagem "Failed to fetch", técnica e em inglês, em vez de uma mensagem que explique o problema ao usuário.
- **Severidade:** baixa. O usuário não perde dados e o site não trava.
- **Prioridade:** baixa. Só acontece quando o servidor está indisponível.
- **Como foi encontrado:** sessão exploratória EXP-02, heurística "Interrupções".
- **Como reproduzir:**
  1. Entrar no site com qualquer usuário (ex.: carla.mendes@biobanco.test / 123456).
  2. No Terminal, desligar o servidor com Control + C.
  3. Sem atualizar a página, clicar em "Adicionar à lista" em qualquer amostra.
- **Resultado esperado:** mensagem em português que explique a situação, por exemplo: "Não foi possível conectar ao servidor. Tente novamente em alguns instantes."
- **Resultado atual:** faixa vermelha com a mensagem "Failed to fetch".
- **Observação:** a mensagem é exibida pelo próprio BioBanco, na área de mensagens do site; o texto vem do erro de conexão do navegador e não é tratado antes de ser mostrado.
- **Evidência:** `EXP-02-servidor-desligado`.
- **Encontrado em:** 25/11/2026, 18h33, por Camila Penha.

## BUG-09: "Amostra não encontrada" ao adicionar amostra depois que o servidor reinicia, sem atualizar a página
- **Decisão:** não corrigir (manter registrado como bug encontrado).
- **Resumo:** depois que o servidor é reiniciado, se a página não for atualizada, tentar adicionar uma amostra que está visível na tela mostra a mensagem "Amostra não encontrada".
- **Severidade:** baixa. Atualizar a página resolve: o sistema encerra a sessão com uma mensagem clara e o usuário entra de novo.
- **Prioridade:** baixa. Depende de o servidor ser reiniciado com a página aberta.
- **Como foi encontrado:** sessão exploratória EXP-02, heurística "Interrupções", logo depois do BUG-08.
- **Como reproduzir:**
  1. Entrar no site com qualquer usuário.
  2. No Terminal, desligar o servidor (Control + C) e ligar de novo (npm start).
  3. **Sem atualizar a página**, clicar em "Adicionar à lista" em qualquer amostra disponível.
- **Resultado esperado:** o sistema perceber que os dados da tela estão desatualizados e orientar o usuário, por exemplo: "Os dados foram atualizados. Recarregue a página." ou encerrar a sessão como acontece depois de atualizar.
- **Resultado atual:** mensagem "Amostra não encontrada", embora a amostra esteja visível no catálogo.
- **Análise:** o banco de dados é em memória; ao reiniciar, as amostras são recriadas com novos identificadores, e a página ainda envia os identificadores antigos. O problema acontece **porque a página não foi atualizada** depois do reinício. Ao atualizar, aparece "Sua sessão expirou. Faça login novamente." e, depois do login, o sistema funciona normalmente.
- **Evidências:** `EXP-02-servidor-religado` (mensagem "Amostra não encontrada") e `EXP-02-apos-atualizar` (sessão encerrada depois de atualizar).
- **Encontrado em:** 25/11/2026, 18h36, por Camila Penha.
