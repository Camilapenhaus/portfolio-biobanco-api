import http from 'k6/http';
import { pegarBaseURL } from '../utils/variaveis.js';

const loginPadrao = JSON.parse(open('../fixtures/postLogin.json'));

const params = {
  headers: { 'Content-Type': 'application/json' },
};

// Faz o login e devolve o token recebido.
// Sem argumentos, usa a pesquisadora do arquivo fixtures/postLogin.json.
export function obterToken(email = loginPadrao.email, senha = loginPadrao.senha) {
  const resposta = http.post(
    `${pegarBaseURL()}/api/auth/login`,
    JSON.stringify({ email, senha }),
    params
  );
  return resposta.json('token');
}

// Cadastra um pesquisador novo (usado para criar uma conta por usuário virtual).
export function cadastrarPesquisador(nome, email, senha) {
  return http.post(
    `${pegarBaseURL()}/api/auth/cadastro`,
    JSON.stringify({ nome, email, senha, instituicao: 'Laboratório de Performance' }),
    params
  );
}
