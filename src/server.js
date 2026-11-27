const { conectar, desconectar } = require('./db');
const { popularBanco } = require('./seed');
const criarApp = require('./app');

const PORTA = process.env.PORT || 3000;

async function iniciar() {
  console.log('Subindo o banco de dados em memória...');
  await conectar();
  await popularBanco();

  const app = criarApp();
  const servidor = app.listen(PORTA, () => {
    console.log('\nBioBanco no ar!');
    console.log(`  Site Web ............ http://localhost:${PORTA}`);
    console.log(`  API REST ............ http://localhost:${PORTA}/api`);
    console.log(`  Swagger UI .......... http://localhost:${PORTA}/api-docs`);
    console.log(`  Especificação YAML .. http://localhost:${PORTA}/swagger.yaml\n`);
  });

  const encerrar = async () => {
    servidor.close();
    await desconectar();
    process.exit(0);
  };
  process.on('SIGINT', encerrar);
  process.on('SIGTERM', encerrar);
}

iniciar().catch((erro) => {
  console.error('Falha ao iniciar o BioBanco:', erro);
  process.exit(1);
});
