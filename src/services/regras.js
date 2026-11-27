// Regras de negócio do BioBanco, isoladas em funções puras
// para ficarem fáceis de ler e de testar.

const DESCONTO_PIX = 0.10;          // Regra 1: 10% de desconto na taxa paga via PIX
const VALOR_TRANSPORTE = 45.0;      // Transporte refrigerado (gelo seco) por solicitação
const LIMITE_PARCEIRO = 300.0;      // Regra 3: vira Parceiro ao acumular R$ 300 em taxas
const FORMAS_PAGAMENTO = ['pix', 'cartao', 'boleto'];

const arredondar = (valor) => Math.round(valor * 100) / 100;

function formaPagamentoValida(forma) {
  return FORMAS_PAGAMENTO.includes(forma);
}

// itens: [{ taxaProcessamento, quantidade }]
function calcularSubtotal(itens) {
  return arredondar(
    itens.reduce((soma, item) => soma + item.taxaProcessamento * item.quantidade, 0)
  );
}

// Regra 2: só entra na lista se houver alíquotas disponíveis
// e a quantidade total pedida não passar do estoque.
function verificarDisponibilidade(estoque, quantidadeJaNaLista, quantidadeNova) {
  if (estoque <= 0) {
    return { ok: false, motivo: 'Amostra sem alíquotas disponíveis no momento' };
  }
  if (quantidadeJaNaLista + quantidadeNova > estoque) {
    return {
      ok: false,
      motivo: `Quantidade solicitada maior que as alíquotas disponíveis (${estoque})`
    };
  }
  return { ok: true };
}

// Regras 1 e 3 aplicadas ao resumo da solicitação
function calcularResumo({ itens, formaPagamento, parceiro }) {
  const subtotal = calcularSubtotal(itens);
  const desconto = formaPagamento === 'pix' ? arredondar(subtotal * DESCONTO_PIX) : 0;
  const transporte = parceiro ? 0 : VALOR_TRANSPORTE;
  const total = arredondar(subtotal - desconto + transporte);
  return { subtotal, desconto, transporte, total, transporteGratis: Boolean(parceiro) };
}

// Regra 3: o valor que conta para virar Parceiro é o que foi pago em taxas
// (subtotal menos desconto), sem o transporte.
function valorQueContaParaParceria(resumo) {
  return arredondar(resumo.subtotal - resumo.desconto);
}

function deveVirarParceiro(totalGasto) {
  return totalGasto >= LIMITE_PARCEIRO;
}

module.exports = {
  DESCONTO_PIX,
  VALOR_TRANSPORTE,
  LIMITE_PARCEIRO,
  FORMAS_PAGAMENTO,
  arredondar,
  formaPagamentoValida,
  calcularSubtotal,
  verificarDisponibilidade,
  calcularResumo,
  valorQueContaParaParceria,
  deveVirarParceiro
};
