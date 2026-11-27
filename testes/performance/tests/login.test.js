// PERF-01: login sob carga esperada.
// Pergunta: o login atende 10 pesquisadores ao mesmo tempo
// com menos de 1% de falhas e 95% das respostas em até 500 ms?
import http from 'k6/http';
import { check, sleep } from 'k6';
import { pegarBaseURL } from '../utils/variaveis.js';

const BASE_URL = pegarBaseURL();
const dadosLogin = open('../fixtures/postLogin.json');

export const options = {
  vus: 10,
  iterations: 50,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const url = `${BASE_URL}/api/auth/login`;
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const resposta = http.post(url, dadosLogin, params);

  check(resposta, {
    'status is 200': (r) => r.status === 200,
    'token is a string': (r) => typeof r.json('token') === 'string',
    'pesquisadora é a Carla': (r) => r.json('pesquisador.email') === 'carla.mendes@biobanco.test',
  });

  sleep(0.3);
}
