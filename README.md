# 🧬 BioBanco

API REST e site Web para **solicitação de amostras biológicas** a um biobanco.

Projeto de portfólio de QA: a aplicação existe para ser testada (testes de API, testes manuais e exploratórios). Por isso ela é pequena, tem regras de negócio claras e vem com dados de teste prontos.

---

## O que é esta aplicação

Um biobanco guarda amostras biológicas (sangue, DNA, culturas de microrganismos) e as disponibiliza para pesquisadores. No BioBanco, o pesquisador:

1. **Cadastro**: cria a conta informando nome, instituição, e-mail e senha.
2. **Login**: entra e recebe um token JWT.
3. **Lista de solicitação**: monta a lista de amostras que quer receber, escolhendo a quantidade de alíquotas de cada uma.
4. **Finalização da solicitação**: escolhe como pagar a taxa de processamento, informa o endereço do laboratório e confirma. O estoque é baixado e a solicitação vai para o histórico.

Tecnologias: Node.js, Express, MongoDB em memória (`mongodb-memory-server` + Mongoose), JWT, Swagger UI e HTML/CSS/JavaScript puro no site.

> Os dados ficam só em memória. Sempre que a aplicação reinicia, o banco volta ao estado inicial com os dados de teste abaixo.

---

## Como instalar

Pré-requisitos: **Node.js 18 ou superior** e **npm**.

```bash
git clone <url-do-repositorio>
```

```bash
cd biobanco
```

```bash
npm install
```

Na primeira execução, o `mongodb-memory-server` baixa um binário do MongoDB (cerca de 100 MB). Isso acontece uma vez só e precisa de internet.

---

## Como executar

```bash
npm start
```

Para desenvolvimento, com reinício automático ao salvar arquivos:

```bash
npm run dev
```

A porta padrão é `3000`. Para usar outra porta:

```bash
PORT=4000 npm start
```

Variáveis de ambiente opcionais:

| Variável     | Padrão                                  | Para que serve            |
|--------------|-----------------------------------------|---------------------------|
| `PORT`       | `3000`                                  | Porta do servidor         |
| `JWT_SECRET` | `biobanco-segredo-de-desenvolvimento`   | Chave de assinatura do JWT |

O token JWT expira em **2 horas**.

---

## Quais dados de teste estão incluídos

### Pesquisadores (senha de todos: `senha123`)

| Nome         | E-mail                      | Instituição                          | Parceiro | Total gasto | Para testar                                   |
|--------------|-----------------------------|--------------------------------------|----------|-------------|-----------------------------------------------|
| Ana Souza    | `ana.souza@biobanco.com`    | Universidade de São Paulo            | Sim      | R$ 350,00   | Transporte grátis (regra 3)                    |
| Bruno Lima   | `bruno.lima@biobanco.com`   | Universidade Federal de Minas Gerais | Não      | R$ 0,00     | Pesquisador comum, paga transporte             |
| Carla Mendes | `carla.mendes@biobanco.com` | Fiocruz                              | Não      | R$ 250,00   | Faltam R$ 50,00 para virar Parceira            |

### Amostras

| Código  | Amostra                              | Tipo               | Armazenamento | Taxa por alíquota | Alíquotas disponíveis |
|---------|--------------------------------------|--------------------|---------------|-------------------|-----------------------|
| BIO-001 | Sangue total humano (EDTA)           | Sangue             | -80 °C        | R$ 80,00          | 10                    |
| BIO-002 | DNA genômico de *Arabidopsis thaliana* | DNA              | -20 °C        | R$ 120,00         | 5                     |
| BIO-003 | Cultura de *Escherichia coli* K-12   | Cultura bacteriana | -80 °C        | R$ 60,00          | **0** (sem estoque)   |

Os ids das amostras são gerados a cada execução. Consulte `GET /api/amostras` para pegar os ids atuais.

---

## Quais são as regras de negócio

| # | Regra | Detalhes |
|---|-------|----------|
| 1 | **Desconto de 10% no PIX** | Se a taxa de processamento for paga via `pix`, o pesquisador recebe 10% de desconto sobre o subtotal das amostras. O desconto não incide sobre o transporte. Formas aceitas: `pix`, `cartao`, `boleto`. |
| 2 | **Só entra na lista amostra com estoque** | Amostras sem alíquotas disponíveis não podem ser adicionadas à lista. A quantidade total de uma amostra na lista também não pode passar do estoque. Na finalização, o estoque é conferido de novo, porque pode ter mudado. |
| 3 | **Transporte grátis só para Parceiros** | O transporte refrigerado custa R$ 45,00 por solicitação. Pesquisadores **Parceiros** não pagam transporte. O pesquisador vira Parceiro quando o total pago em taxas (subtotal menos desconto, sem transporte) chega a **R$ 300,00**. O benefício vale a partir da solicitação seguinte. |

### Como o total é calculado

```
subtotal   = soma de (taxa da amostra × quantidade)
desconto   = 10% do subtotal, se o pagamento for PIX; senão 0
transporte = 0 se o pesquisador já for Parceiro; senão R$ 45,00
total      = subtotal - desconto + transporte
```

Exemplo com a Carla (R$ 250,00 acumulados, não Parceira), pedindo 1 alíquota de BIO-001 via PIX:
subtotal R$ 80,00, desconto R$ 8,00, transporte R$ 45,00, total **R$ 117,00**. Ela passa a ter R$ 322,00 acumulados e vira Parceira; a próxima solicitação já sai sem transporte.

### Códigos de resposta mais importantes

| Código | Quando acontece |
|--------|-----------------|
| 400 | Campo obrigatório ausente, formato inválido, forma de pagamento inválida, lista vazia |
| 401 | Sem token, token inválido/expirado ou login com credenciais erradas |
| 404 | Amostra ou solicitação não encontrada |
| 409 | Cadastro com e-mail já existente |
| 422 | Regra 2 violada: amostra sem estoque ou quantidade maior que o disponível |

---

## Quais são as URLs importantes para acessar a aplicação

Com a aplicação rodando na porta padrão:

| O quê | URL |
|-------|-----|
| Site Web | http://localhost:3000 |
| Swagger UI (documentação interativa) | http://localhost:3000/api-docs |
| Especificação da API em YAML | http://localhost:3000/swagger.yaml |
| Base da API REST | http://localhost:3000/api |
| Health check | http://localhost:3000/api/health |

### Endpoints da API

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST   | `/api/auth/cadastro` | Não | Cadastrar pesquisador |
| POST   | `/api/auth/login` | Não | Login (retorna o token) |
| GET    | `/api/amostras` | Não | Catálogo de amostras |
| GET    | `/api/amostras/{id}` | Não | Detalhe de uma amostra |
| GET    | `/api/lista` | Sim | Ver a lista de solicitação |
| GET    | `/api/lista/resumo?formaPagamento=pix` | Sim | Prévia de subtotal, desconto, transporte e total |
| POST   | `/api/lista/itens` | Sim | Adicionar amostra à lista |
| DELETE | `/api/lista/itens/{amostraId}` | Sim | Remover amostra da lista |
| DELETE | `/api/lista` | Sim | Esvaziar a lista |
| POST   | `/api/solicitacoes` | Sim | Finalizar a solicitação |
| GET    | `/api/solicitacoes` | Sim | Histórico de solicitações |
| GET    | `/api/solicitacoes/{id}` | Sim | Detalhe de uma solicitação |
| GET    | `/api/pesquisadores/me` | Sim | Perfil do pesquisador logado |

Nas rotas com autenticação, envie o cabeçalho `Authorization: Bearer <token>`. No Swagger UI, use o botão **Authorize** e cole só o token.

---

## Estrutura do projeto

```
biobanco/
├── docs/swagger.yaml          # Especificação OpenAPI
├── public/                    # Site Web (HTML, CSS, JS)
└── src/
    ├── server.js              # Sobe o banco em memória, popula e inicia o servidor
    ├── app.js                 # Express, rotas, Swagger e tratamento de erros
    ├── db.js                  # Conexão com o mongodb-memory-server
    ├── seed.js                # Dados de teste
    ├── middlewares/           # Autenticação JWT
    ├── models/                # Pesquisador, Amostra, Solicitacao
    ├── routes/                # Rotas da API
    └── services/regras.js     # Regras de negócio
```

Os elementos do site têm atributos `data-testid`, para facilitar a localização dos elementos em testes.

Este repositório não inclui automação de testes: os testes da aplicação ficam em um projeto separado.
