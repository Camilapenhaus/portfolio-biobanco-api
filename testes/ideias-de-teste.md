# BioBanco: ideias de teste e testes realizados

Cenários que surgiram durante a construção do projeto e testes já executados pela Camila, para registrar na fase de testes.

## Como os testes são numerados
- Cada tipo de teste tem o seu prefixo e a sua contagem, começando em 01:
  - **ACE-xx:** acessibilidade
  - **FUN-xx:** funcional
  - **EXP-xx:** exploratório (próxima etapa)
  - **PERF-xx:** performance com k6 (etapa seguinte)
- O número é um identificador: depois de dado, não muda nem é reaproveitado.
- Só recebe número o teste que foi **executado**. Ideias ainda não executadas ficam sem número, na seção "Ideias de teste para executar".
- Renumeração feita em 24/11/2026 (antes era tudo "TESTE-xx"): TESTE-02 → ACE-01; TESTE-03 → FUN-01; TESTE-04 a TESTE-16 → ACE-02 a ACE-14; TESTE-01 voltou a ser ideia sem número.

## Testes de acessibilidade realizados (ACE-01 a ACE-14)

### ACE-01 (acessibilidade): chavinha de modo claro/escuro pelo teclado
- **Data:** 24/11/2026
- **Pré-condição:** aplicação ligada (`npm start`), site aberto em http://localhost:3000.
- **Passos:**
  1. Apertar **Tab** até a chavinha de modo (canto superior direito) ficar contornada.
  2. Apertar **Espaço** (ou **Enter**).
  3. Recarregar a página (Command + R).
- **Resultado esperado:** a chavinha recebe foco visível, alterna entre modo claro e modo escuro usando só o teclado, e o site lembra a escolha depois de recarregar.
- **Resultado obtido:** ✅ funcionou como esperado.
- **Tipo:** teste de acessibilidade (navegação só por teclado) e de persistência da preferência.
- **Status:** Passou.

### Testes de acessibilidade com o axe DevTools (ACE-02 a ACE-07)
- **Ferramenta:** axe DevTools (axe-core 4.13.0), varredura da página inteira, regra WCAG 2.1 AA, "Best Practices" desligado.
- **Como rodar:** botão direito > Inspect (ou Command + Option + I) > aba axe DevTools > "Scan ALL of my page" / "Re-run scan".
- **Resultado esperado em todos:** nenhum problema de acessibilidade encontrado automaticamente.

| Teste | Tela | Modo | Resultado | Status |
|---|---|---|---|---|
| ACE-02 (17:25) | Entrada, aba Entrar | Claro | 1 problema Serious: contraste da aba ativa "Entrar" (3.16:1, esperado 4.5:1) | ❌ Falhou → **BUG-02** |
| ACE-03 (17:31) | Entrada, aba Entrar | Escuro | 0 problemas | ✅ Passou |
| ACE-04 (17:34) | Entrada, aba Cadastrar | Claro | 1 problema Serious: contraste da aba ativa "Cadastrar" (`data-testid="aba-cadastro"`), confirmado com Highlight | ❌ Falhou → **BUG-02** (2ª ocorrência, mesma causa) |
| ACE-05 (17:38) | Entrada, aba Cadastrar | Escuro | 0 problemas | ✅ Passou |
| ACE-06 (17:41) | Catálogo de amostras (logada) | Claro | 0 problemas | ✅ Passou |
| ACE-07 (17:43) | Catálogo de amostras (logada) | Escuro | 0 problemas | ✅ Passou |

- **Conclusões:**
  - O único problema automático encontrado é o contraste do texto da **aba ativa** no **modo claro** (BUG-02). No modo escuro, todas as telas passaram.
  - O mesmo elemento pode falhar num modo de cor e passar no outro: cada modo precisa ser testado separadamente.
  - A segunda ocorrência do contraste foi registrada no mesmo bug, para evitar bug duplicado.
- **Limitações observadas:**
  - O axe **não mede contraste de texto sobre degradê** (texto branco dos botões "Adicionar à lista" e "Confirmar solicitação", azul → turquesa). Precisa de conferência manual.
  - 0 problemas automáticos não significa página 100% acessível: os testes manuais (teclado, leitor de tela, zoom) continuam necessários.
  - As varreduras do catálogo foram feitas com a lista vazia; com amostras na lista e histórico preenchido, aparecem mais elementos para testar.
- **Evidências:** fotos das telas do axe DevTools de cada varredura (24/11/2026). Para o portfólio, preferir prints logada com as usuárias fictícias (ex.: Carla Mendes), sem dados pessoais reais.

### ACE-08 (acessibilidade, Lighthouse): nota da página de entrada, modo claro
- **Data:** 24/11/2026, 17:49
- **Ferramenta:** Lighthouse (aba do DevTools do Chrome). Configuração: Mode **Navigation**, Device **Desktop**, Category só **Accessibility**.
- **Passos:** página de entrada, modo claro; DevTools > aba Lighthouse; configurar; clicar em "Analyze page load".
- **Resultado esperado:** nota de acessibilidade alta (90 ou mais) e nenhum problema de contraste.
- **Resultado obtido:**
  - Nota **96** de 100 (verde).
  - 1 falha na seção **Contrast**: "Background and foreground colors do not have a sufficient contrast ratio" (cores de fundo e de texto sem contraste suficiente).
  - **21 verificações aprovadas** (Passed audits).
  - **10 itens para conferir manualmente** (Additional items to manually check), que o Lighthouse não consegue verificar sozinho.
- **Status:** Passou parcialmente (nota boa, mas com 1 falha de contraste).
- **Conclusão:** o Lighthouse confirmou o mesmo problema que o axe encontrou (BUG-02). **Duas ferramentas diferentes apontando o mesmo defeito** deixam o bug mais confiável. Os 4 pontos que faltaram para 100 vêm dessa falha de contraste.
- **Aviso da execução:** o Lighthouse mostrou "Clearing the browser cache timed out" (a limpeza do cache do navegador demorou demais). É um aviso da própria ferramenta, não um defeito do BioBanco; se quiser, dá para rodar de novo.

### ACE-09 (acessibilidade, Lighthouse): catálogo de amostras logada, modo claro
- **Data:** 24/11/2026, 17:57
- **Ferramenta:** Lighthouse, Mode **Snapshot** (analisa a página do jeito que ela está, sem recarregar), Device **Desktop**, Category só **Accessibility**.
- **Por que Snapshot:** o modo Navigation recarrega a página e limpa o armazenamento do navegador, o que desfaz o login. O Snapshot mostra o resultado como "x de y verificações", e não como nota de 0 a 100.
- **Pré-condição:** logada como Ana Souza (ana.souza@biobanco.test / 123456), modo claro.
- **Resultado esperado:** todas as verificações aprovadas.
- **Resultado obtido:** **25 de 26** aprovadas. 1 falha: "Touch targets do not have sufficient size or spacing" (áreas de toque pequenas ou próximas demais), nos 3 radio buttons de pagamento (PIX, Cartão, Boleto).
- **Status:** ❌ Falhou → **BUG-03**.
- **Conclusão:** o Lighthouse achou um problema que o axe não achou (o axe estava na regra WCAG 2.1; tamanho de área de toque é da WCAG 2.2). **Usar mais de uma ferramenta amplia a cobertura.**

### ACE-10 e ACE-11 (acessibilidade, manual): solicitação inteira só com o teclado
- **Data:** 24/11/2026 (ACE-10 no modo claro; ACE-11 no modo escuro, 18:14)
- **Pré-condição:** DevTools fechado, deslogada. Sem usar mouse nem trackpad.
- **Passos:**
  1. **Tab** até o campo de e-mail; digitar `carla.mendes@biobanco.test`.
  2. **Tab** até a senha; digitar `123456`; **Enter**.
  3. **Tab** até "Adicionar à lista" de uma amostra; **Enter**.
  4. **Tab** até a forma de pagamento; **setas** para escolher Boleto.
  5. **Tab** até o endereço; digitar; **Tab** até "Confirmar solicitação"; **Enter**.
  - No ACE-11, antes de começar: **Tab** até a chavinha de modo e **Espaço** para ligar o modo escuro.
- **Resultado esperado:** foco sempre visível e fácil de ver; ordem do Tab lógica; nenhum ponto em que o teclado fique preso.

| Teste | Modo | Ordem do Tab | Armadilha de teclado | Foco visível | Status |
|---|---|---|---|---|---|
| ACE-10 | Claro | ✅ Correta (de cima para baixo, da esquerda para a direita) | ✅ Nenhuma | ❌ Suave demais, difícil de achar | Passou parcialmente → **BUG-04** |
| ACE-11 | Escuro | ✅ Correta | ✅ Nenhuma | ❌ Igual ao modo claro: suave, confuso para quem tem dificuldade | Passou parcialmente → **BUG-04** (mesma causa) |

- **Conclusões:**
  - A navegação pelo teclado **funciona** (ordem correta, nada trava), mas o **destaque de onde o teclado está é fraco nos dois modos**.
  - Diferente do contraste da aba ativa (BUG-02), que só falha no modo claro, esse problema aparece nos dois modos: a causa não é a cor do tema, e sim a falta de um estilo de foco próprio para botões e opções.
  - Nenhuma ferramenta automática apontou esse problema; só o teste manual encontrou.
- **Evidência:** foto do modo escuro com o campo de quantidade da amostra BIO-002 em foco (18:14).

### ACE-12 (acessibilidade, manual): zoom de 200%
- **Data:** 24/11/2026, 18:23
- **Pré-condição:** logada como Carla Mendes (carla.mendes@biobanco.test / 123456), modo claro.
- **Passos:**
  1. Apertar **Command +** até o zoom do Chrome chegar a **200%**.
  2. Rolar a página de cima a baixo.
  3. Adicionar uma amostra à lista e finalizar uma solicitação.
  4. Voltar ao tamanho normal com **Command 0**.
- **Resultado esperado:** com zoom de 200%, nenhum conteúdo some ou fica cortado, todos os botões continuam utilizáveis e não é preciso rolar para os lados (WCAG 1.4.4, Redimensionar texto, e 1.4.10, Refluxo).
- **Resultado obtido:**
  - ✅ Os cartões das amostras se reorganizaram (2 por linha no lugar de 3).
  - ✅ Botões e campos continuam visíveis e utilizáveis; foi possível navegar, selecionar, adicionar à lista e finalizar a solicitação.
  - ✅ Não apareceu barra de rolagem horizontal.
  - ⚠️ Observação leve: no topo, as laterais pareceram cortar "um pouquinho"; não atrapalhou o uso.
- **Status:** ✅ Passou (com uma observação cosmética, sem impacto no uso; não registrada como bug).
- **Evidência:** foto da tela com zoom de 200%, cabeçalho e início do catálogo (18:23).

### ACE-13 (acessibilidade, manual): chavinha de tema com o leitor de tela VoiceOver
- **Data:** 24/11/2026, 18:36
- **Ferramenta:** VoiceOver (leitor de tela do Mac; liga e desliga com Command + F5). Mac e Chrome em inglês, então as falas do VoiceOver saem em inglês e os textos do site em português.
- **Pré-condição:** logada como Carla Mendes, modo claro.
- **Passos:**
  1. Ligar o VoiceOver.
  2. **Tab** até a chavinha de modo e escutar.
  3. Apertar **Espaço** para trocar o modo e escutar.
  4. **Shift + Tab** e depois **Tab** (sair e voltar para a chavinha) e escutar de novo.
- **Resultado esperado:** o VoiceOver anuncia o nome, que é um interruptor e se está ligado ou desligado; ao trocar, anuncia o novo estado.
- **Resultado obtido:**
  - ✅ Ao chegar na chavinha: leu "Ativar modo escuro. You are currently on a switch, inside of web content. To toggle this switch, press Control-Option-Space…" (reconheceu como **interruptor** e explicou como usar).
  - ⚠️ Ao apertar Espaço: o modo trocou na tela, mas o VoiceOver **não falou nada**; a legenda antiga ("Ativar modo escuro") continuou parada.
  - ✅ Ao sair e voltar para a chavinha: leu o estado novo corretamente (modo escuro ativado; para voltar ao modo claro, alternar o interruptor).
- **Status:** ✅ Passou, com observação.
- **Observação (não registrada como bug):** o estado da chavinha está certo para o leitor de tela (o código atualiza `aria-checked` e o `title`), mas a troca **não é anunciada no momento** em que acontece. Quem usa leitor de tela só descobre se funcionou saindo e voltando. Não é falha da WCAG (o estado fica disponível), mas é uma melhoria de usabilidade; pode depender da combinação Chrome + VoiceOver. Seria bom repetir no Safari para comparar.
- **Evidência:** foto da legenda do VoiceOver na chavinha (18:36).

### ACE-14 (acessibilidade, manual): contraste do texto branco nos botões em degradê
- **Data:** 24/11/2026, 18:46
- **Por que manual:** o axe e o Lighthouse não medem contraste de texto sobre degradê (limitação anotada nos ACE-02 a ACE-07).
- **Ferramenta:** WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/).
- **Passos:** Foreground `FFFFFF` (texto branco); Background `1E7FC2` (ponta azul do degradê) e depois `2EC4B6` (ponta turquesa). Cores tiradas de `public/css/style.css` (variável `--botao`).
- **Resultado esperado:** pelo menos 4.5:1 nas duas pontas (texto de 16px semi-negrito = texto normal).
- **Resultado obtido:** ponta azul **4.31:1** (falha em texto normal AA, passa só em texto grande AA); ponta turquesa **2.16:1** (falha em tudo).
- **Status:** ❌ Falhou → **BUG-05**.
- **Conclusão:** um terceiro tipo de problema de contraste que **só o teste manual encontrou**. Ferramentas automáticas têm pontos cegos (como degradês), e saber disso faz parte do trabalho de QA.

## Testes funcionais realizados

### FUN-01 (funcional, caminho feliz): cadastro de nova pesquisadora e login com ela
- **Data:** 24/11/2026
- **Pré-condição:** aplicação ligada, página de entrada aberta.
- **Passos:**
  1. Clicar na aba **Cadastrar**.
  2. Preencher nome (Camila Penha), instituição, e-mail `camila.penha@biobanco.test` e senha `123456`.
  3. Clicar em **Criar conta**.
  4. Entrar com o e-mail e a senha cadastrados.
- **Resultado esperado:** o cadastro é aceito com mensagem de sucesso e o login funciona com a conta nova.
- **Resultado obtido:** ✅ o cadastro foi aceito e o acesso funcionou.
- **Tipo:** teste funcional positivo ("caminho feliz": dados corretos, tudo deve dar certo).
- **Status:** Passou.
- **Observação:** contas criadas pelo cadastro ficam só em memória e somem quando a aplicação é desligada (comportamento esperado, documentado no README).

## Ideias de teste para executar

### Login e cadastro (testes negativos)
- Executados como casos de teste CT-09 a CT-16 (ver `biobanco/casos-de-teste.md`), incluindo o login com o e-mail antigo (.com), que virou o CT-16.
- Ainda a fazer, na exploração da API: conta criada pelo cadastro depois de desligar e ligar a aplicação (esperado: a conta não existe mais, porque o banco é em memória); senha curta e e-mail inválido enviados direto ao servidor.

### Acessibilidade (próximos)
- Repetir o ACE-13 (VoiceOver na chavinha) no Safari, para ver se a troca é anunciada na hora.
- Lighthouse no modo escuro (para comparar).
- Os 10 itens de "Additional items to manually check" do Lighthouse, como roteiro de testes manuais.
- axe DevTools no catálogo com amostras na lista e com o histórico preenchido (mais elementos na tela).
- axe DevTools com mensagens de erro na tela (ex.: login errado).
- axe DevTools com "Best Practices" ligado (boas práticas extras além da WCAG).
- Layout responsivo: como o site fica numa tela estreita (celular).

## Observações para investigar
- Mensagem do navegador "Please fill out this field." no campo de endereço da finalização: anotada no primeiro dia como "não reproduzível". **Reproduzida em 25/11/2026 na EXP-03**: aparece ao confirmar a solicitação com o endereço vazio (validação de campo obrigatório do navegador).

## Bugs encontrados
- Ver `biobanco/bugs-encontrados.md`:
  - BUG-01: transporte cobrado com a lista vazia (só para não Parceiros).
  - BUG-02: contraste insuficiente nas abas ativas "Entrar" e "Cadastrar" (modo claro).
  - BUG-03: área de toque pequena nos botões de pagamento.
  - BUG-04: foco do teclado pouco visível (modos claro e escuro).
  - BUG-05: contraste insuficiente do texto branco nos botões em degradê (modos claro e escuro).
