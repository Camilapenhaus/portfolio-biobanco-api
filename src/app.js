const fs = require('fs');
const path = require('path');
const express = require('express');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const rotasAuth = require('./routes/auth');
const rotasAmostras = require('./routes/amostras');
const rotasLista = require('./routes/lista');
const rotasSolicitacoes = require('./routes/solicitacoes');
const rotasPesquisadores = require('./routes/pesquisadores');

const CAMINHO_SWAGGER = path.join(__dirname, '..', 'docs', 'swagger.yaml');

function criarApp() {
  const app = express();
  app.use(express.json());

  // Site Web (arquivos estáticos)
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Documentação: Swagger UI renderizando o YAML + o YAML cru
  const especificacao = yaml.load(fs.readFileSync(CAMINHO_SWAGGER, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(especificacao, {
    customSiteTitle: 'BioBanco API'
  }));
  app.get('/swagger.yaml', (_req, res) => res.type('text/yaml').sendFile(CAMINHO_SWAGGER));

  // API REST
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', rotasAuth);
  app.use('/api/amostras', rotasAmostras);
  app.use('/api/lista', rotasLista);
  app.use('/api/solicitacoes', rotasSolicitacoes);
  app.use('/api/pesquisadores', rotasPesquisadores);

  app.use('/api', (_req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

  // Tratador de erros
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
    }
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  });

  return app;
}

module.exports = criarApp;
