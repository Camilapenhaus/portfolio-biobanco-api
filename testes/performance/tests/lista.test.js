// PERF-02: adicionar e remover amostra da lista sob carga esperada.
// Pergunta: a lista de solicitação atende 10 pesquisadores ao mesmo tempo
// com menos de 1% de falhas e 95% das respostas em até 500 ms?
//
// Preparação (setup): cria uma conta para cada usuário virtual, faz o login
// de cada uma e descobre o id da BIO-006 no catálogo. Assim cada usuário
// virtual mexe só na própria lista, e o login não entra na medição.
import http from 'k6/http';
import { check, sleep } from 'k6';
import { pegarBaseURL } from '../utils/variaveis.js';
import { obterToken, cadastrarPesquisador } from '../helpers/autenticacao.js';

const BASE_URL = pegarBaseURL();
const USUARIOS_VIRTUAIS = 10;
const SENHA = '123456';

export const options = {
  vus: USUARIOS_VIRTUAIS,
  duration: '30s',
  thresholds: {
    // Só as requisições do fluxo medido (marcadas com a tag fluxo:lista)
    'http_req_failed{fluxo:lista}': ['rate<0.01'],
    'http_req_duration{fluxo:lista}': ['p(95)<500'],
  },
};

export function setup() {
  const execucao = Date.now();
  const tokens = [];

  for (let i = 1; i <= USUARIOS_VIRTUAIS; i++) {
    const email = `perf.vu${i}.${execucao}@biobanco.test`;
    cadastrarPesquisador(`Pesquisador Performance ${i}`, email, SENHA);
    tokens.push(obterToken(email, SENHA));
  }

  const amostras = http.get(`${BASE_URL}/api/amostras`).json();
  const levedura = amostras.find((amostra) => amostra.codigo === 'BIO-006');

  return { tokens, amostraId: levedura.id };
}

export default function (dados) {
  const token = dados.tokens[(__VU - 1) % dados.tokens.length];
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    tags: { fluxo: 'lista' },
  };

  const adicionar = http.post(
    `${BASE_URL}/api/lista/itens`,
    JSON.stringify({ amostraId: dados.amostraId, quantidade: 1 }),
    params
  );

  check(adicionar, {
    'adicionar: status is 201': (r) => r.status === 201,
    'adicionar: levedura na lista': (r) => r.json('itens.0.codigo') === 'BIO-006',
  });

  const remover = http.del(`${BASE_URL}/api/lista/itens/${dados.amostraId}`, null, params);

  check(remover, {
    'remover: status is 200': (r) => r.status === 200,
    'remover: lista vazia': (r) => r.json('itens').length === 0,
  });

  sleep(0.3);
}
