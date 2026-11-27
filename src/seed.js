const Amostra = require('./models/Amostra');
const Pesquisador = require('./models/Pesquisador');

const SENHA_PADRAO = 'senha123';

const amostras = [
  {
    codigo: 'BIO-001',
    nome: 'Sangue total humano (EDTA)',
    especie: 'Homo sapiens',
    tipo: 'Sangue',
    descricao: 'Alíquota de 1 mL de sangue total coletado em tubo com EDTA.',
    armazenamento: '-80 °C',
    taxaProcessamento: 80.0,
    estoque: 10
  },
  {
    codigo: 'BIO-002',
    nome: 'DNA genômico de Arabidopsis thaliana',
    especie: 'Arabidopsis thaliana',
    tipo: 'DNA',
    descricao: 'Alíquota de 50 µL de DNA extraído de folhas (ecótipo Col-0).',
    armazenamento: '-20 °C',
    taxaProcessamento: 120.0,
    estoque: 5
  },
  {
    codigo: 'BIO-003',
    nome: 'Cultura de Escherichia coli K-12',
    especie: 'Escherichia coli',
    tipo: 'Cultura bacteriana',
    descricao: 'Estoque em glicerol 20%. Sem alíquotas disponíveis no momento.',
    armazenamento: '-80 °C',
    taxaProcessamento: 60.0,
    estoque: 0
  }
];

const pesquisadores = [
  {
    nome: 'Ana Souza',
    email: 'ana.souza@biobanco.com',
    instituicao: 'Universidade de São Paulo',
    parceiro: true,
    totalGasto: 350.0
  },
  {
    nome: 'Bruno Lima',
    email: 'bruno.lima@biobanco.com',
    instituicao: 'Universidade Federal de Minas Gerais',
    parceiro: false,
    totalGasto: 0
  },
  {
    nome: 'Carla Mendes',
    email: 'carla.mendes@biobanco.com',
    instituicao: 'Fiocruz',
    parceiro: false,
    totalGasto: 250.0
  }
];

async function popularBanco() {
  await Amostra.deleteMany({});
  await Pesquisador.deleteMany({});

  await Amostra.insertMany(amostras);

  for (const dados of pesquisadores) {
    const pesquisador = new Pesquisador(dados);
    pesquisador.definirSenha(SENHA_PADRAO);
    await pesquisador.save();
  }
}

module.exports = { popularBanco, SENHA_PADRAO };
