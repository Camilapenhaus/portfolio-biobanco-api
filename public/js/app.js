// Site Web do BioBanco: consome a API REST da mesma aplicação.
const estado = {
  token: sessionStorage.getItem('biobanco_token'),
  pesquisador: null,
  lista: { itens: [], subtotal: 0 }
};

const $ = (seletor) => document.querySelector(seletor);
const moeda = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function mostrarMensagem(texto, tipo = 'sucesso') {
  const caixa = $('#mensagem');
  caixa.textContent = texto;
  caixa.className = `mensagem ${tipo}`;
  clearTimeout(mostrarMensagem.timer);
  mostrarMensagem.timer = setTimeout(() => caixa.classList.add('oculto'), 6000);
}

async function api(caminho, { metodo = 'GET', corpo } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (estado.token) headers.Authorization = `Bearer ${estado.token}`;

  const resposta = await fetch(`/api${caminho}`, {
    method: metodo,
    headers,
    body: corpo ? JSON.stringify(corpo) : undefined
  });
  const dados = resposta.status === 204 ? null : await resposta.json().catch(() => null);

  if (resposta.status === 401 && estado.token) {
    sair();
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }
  if (!resposta.ok) throw new Error((dados && dados.erro) || 'Erro inesperado');
  return dados;
}

// ---------- Login e cadastro ----------
document.querySelectorAll('.aba').forEach((aba) => {
  aba.addEventListener('click', () => {
    document.querySelectorAll('.aba').forEach((a) => a.classList.toggle('ativa', a === aba));
    $('#form-login').classList.toggle('oculto', aba.dataset.aba !== 'login');
    $('#form-cadastro').classList.toggle('oculto', aba.dataset.aba !== 'cadastro');
  });
});

$('#form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const dados = await api('/auth/login', {
      metodo: 'POST',
      corpo: { email: $('#login-email').value, senha: $('#login-senha').value }
    });
    estado.token = dados.token;
    sessionStorage.setItem('biobanco_token', dados.token);
    $('#form-login').reset();
    await entrarNoApp();
    mostrarMensagem(`Bem-vindo(a), ${dados.pesquisador.nome}!`);
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

$('#form-cadastro').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await api('/auth/cadastro', {
      metodo: 'POST',
      corpo: {
        nome: $('#cadastro-nome').value,
        instituicao: $('#cadastro-instituicao').value,
        email: $('#cadastro-email').value,
        senha: $('#cadastro-senha').value
      }
    });
    $('#login-email').value = $('#cadastro-email').value;
    $('#form-cadastro').reset();
    document.querySelector('[data-aba="login"]').click();
    mostrarMensagem('Cadastro realizado! Agora é só entrar com sua senha.');
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

function sair() {
  estado.token = null;
  estado.pesquisador = null;
  sessionStorage.removeItem('biobanco_token');
  $('#tela-app').classList.add('oculto');
  $('#area-usuario').classList.add('oculto');
  $('#tela-acesso').classList.remove('oculto');
}
$('#btn-sair').addEventListener('click', sair);

// ---------- Área logada ----------
async function entrarNoApp() {
  $('#tela-acesso').classList.add('oculto');
  $('#tela-app').classList.remove('oculto');
  $('#area-usuario').classList.remove('oculto');
  await Promise.all([carregarPerfil(), carregarCatalogo(), carregarLista(), carregarHistorico()]);
}

async function carregarPerfil() {
  estado.pesquisador = await api('/pesquisadores/me');
  $('#nome-usuario').textContent = `${estado.pesquisador.nome} · ${estado.pesquisador.instituicao}`;
  $('#selo-parceiro').classList.toggle('oculto', !estado.pesquisador.parceiro);
}

async function carregarCatalogo() {
  const amostras = await api('/amostras');
  const grade = $('#lista-amostras');
  grade.innerHTML = '';

  amostras.forEach((amostra) => {
    const esgotada = amostra.estoque <= 0;
    const cartao = document.createElement('article');
    cartao.className = 'cartao amostra';
    cartao.dataset.testid = `amostra-${amostra.codigo}`;
    cartao.innerHTML = `
      <span class="codigo"></span>
      <h3></h3>
      <p class="especie"></p>
      <p class="detalhes"></p>
      <span class="taxa"></span>
      <span class="estoque ${esgotada ? 'esgotado' : ''}" data-testid="estoque-${amostra.codigo}"></span>
      <div class="acoes">
        <input type="number" min="1" value="1" aria-label="Quantidade" data-testid="quantidade-${amostra.codigo}" ${esgotada ? 'disabled' : ''} />
        <button class="btn btn-pequeno" data-testid="adicionar-${amostra.codigo}" ${esgotada ? 'disabled' : ''}>Adicionar à lista</button>
      </div>`;
    cartao.querySelector('.codigo').textContent = `${amostra.codigo} · ${amostra.tipo}`;
    cartao.querySelector('h3').textContent = amostra.nome;
    cartao.querySelector('.especie').textContent = amostra.especie;
    cartao.querySelector('.detalhes').textContent = `${amostra.descricao} Armazenamento: ${amostra.armazenamento}.`;
    cartao.querySelector('.taxa').textContent = `${moeda(amostra.taxaProcessamento)} por alíquota`;
    cartao.querySelector('.estoque').textContent = esgotada
      ? 'Sem alíquotas disponíveis'
      : `${amostra.estoque} alíquota(s) disponível(is)`;

    cartao.querySelector('button').addEventListener('click', async () => {
      const quantidade = Number(cartao.querySelector('input').value);
      try {
        estado.lista = await api('/lista/itens', {
          metodo: 'POST',
          corpo: { amostraId: amostra.id, quantidade }
        });
        desenharLista();
        mostrarMensagem(`${amostra.nome} adicionada à lista.`);
      } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
      }
    });
    grade.appendChild(cartao);
  });
}

async function carregarLista() {
  estado.lista = await api('/lista');
  desenharLista();
}

function desenharLista() {
  const ul = $('#itens-lista');
  ul.innerHTML = '';
  estado.lista.itens.forEach((item) => {
    const li = document.createElement('li');
    li.dataset.testid = `item-lista-${item.codigo}`;
    const texto = document.createElement('span');
    texto.textContent = `${item.quantidade}x ${item.nome} — ${moeda(item.subtotalItem)}`;
    const remover = document.createElement('button');
    remover.className = 'btn btn-secundario btn-pequeno';
    remover.textContent = 'Remover';
    remover.dataset.testid = `remover-${item.codigo}`;
    remover.addEventListener('click', async () => {
      try {
        estado.lista = await api(`/lista/itens/${item.amostraId}`, { metodo: 'DELETE' });
        desenharLista();
      } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
      }
    });
    li.append(texto, remover);
    ul.appendChild(li);
  });

  const vazia = estado.lista.itens.length === 0;
  $('#lista-vazia').classList.toggle('oculto', !vazia);
  $('#btn-esvaziar').classList.toggle('oculto', vazia);
  $('#btn-finalizar').disabled = vazia;
  atualizarResumo();
}

function formaPagamentoEscolhida() {
  return document.querySelector('input[name="pagamento"]:checked').value;
}

async function atualizarResumo() {
  if (!estado.token) return;
  try {
    const resumo = await api(`/lista/resumo?formaPagamento=${formaPagamentoEscolhida()}`);
    $('#resumo-subtotal').textContent = moeda(resumo.subtotal);
    $('#resumo-desconto').textContent = `- ${moeda(resumo.desconto)}`;
    $('#resumo-transporte').textContent = resumo.transporteGratis
      ? 'Grátis (Parceiro)'
      : moeda(resumo.transporte);
    $('#resumo-total').textContent = moeda(resumo.total);
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}
document.querySelectorAll('input[name="pagamento"]').forEach((radio) =>
  radio.addEventListener('change', atualizarResumo)
);

$('#btn-esvaziar').addEventListener('click', async () => {
  try {
    await api('/lista', { metodo: 'DELETE' });
    estado.lista = { itens: [], subtotal: 0 };
    desenharLista();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

$('#form-finalizar').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const resposta = await api('/solicitacoes', {
      metodo: 'POST',
      corpo: { formaPagamento: formaPagamentoEscolhida(), enderecoEntrega: $('#endereco').value }
    });
    $('#endereco').value = '';
    mostrarMensagem(`${resposta.mensagem} Total: ${moeda(resposta.solicitacao.total)}`);
    await Promise.all([carregarPerfil(), carregarCatalogo(), carregarLista(), carregarHistorico()]);
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

async function carregarHistorico() {
  const solicitacoes = await api('/solicitacoes');
  const ul = $('#historico');
  ul.innerHTML = '';
  if (solicitacoes.length === 0) {
    ul.innerHTML = '<li class="vazio">Você ainda não fez solicitações.</li>';
    return;
  }
  solicitacoes.forEach((s) => {
    const li = document.createElement('li');
    const data = new Date(s.createdAt).toLocaleString('pt-BR');
    const amostras = s.itens.map((i) => `${i.quantidade}x ${i.codigo}`).join(', ');
    li.textContent = `${data} · ${amostras} · ${s.formaPagamento.toUpperCase()} · Total ${moeda(s.total)}`;
    ul.appendChild(li);
  });
}

// Se já havia sessão aberta, entra direto
if (estado.token) {
  entrarNoApp().catch((erro) => mostrarMensagem(erro.message, 'erro'));
}
