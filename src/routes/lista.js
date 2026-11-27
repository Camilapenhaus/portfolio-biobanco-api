const express = require('express');
const mongoose = require('mongoose');
const Amostra = require('../models/Amostra');
const Pesquisador = require('../models/Pesquisador');
const { exigirLogin } = require('../middlewares/autenticacao');
const regras = require('../services/regras');
const asyncHandler = require('./asyncHandler');

const router = express.Router();
router.use(exigirLogin);

async function carregarPesquisador(req, res) {
  const pesquisador = await Pesquisador.findById(req.pesquisadorId).populate('lista.amostra');
  if (!pesquisador) {
    res.status(401).json({ erro: 'Pesquisador do token não existe mais' });
    return null;
  }
  // Remove da lista amostras que deixaram de existir
  pesquisador.lista = pesquisador.lista.filter((item) => item.amostra);
  return pesquisador;
}

function montarLista(pesquisador) {
  const itens = pesquisador.lista.map((item) => ({
    amostraId: item.amostra._id.toString(),
    codigo: item.amostra.codigo,
    nome: item.amostra.nome,
    taxaProcessamento: item.amostra.taxaProcessamento,
    quantidade: item.quantidade,
    subtotalItem: regras.arredondar(item.amostra.taxaProcessamento * item.quantidade)
  }));
  return { itens, subtotal: regras.calcularSubtotal(itens) };
}

// Ver a lista de solicitação ("carrinho")
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const pesquisador = await carregarPesquisador(req, res);
    if (!pesquisador) return undefined;
    return res.status(200).json(montarLista(pesquisador));
  })
);

// Prévia dos valores antes de finalizar
router.get(
  '/resumo',
  asyncHandler(async (req, res) => {
    const { formaPagamento } = req.query;
    if (!regras.formaPagamentoValida(formaPagamento)) {
      return res.status(400).json({
        erro: `formaPagamento deve ser uma destas: ${regras.FORMAS_PAGAMENTO.join(', ')}`
      });
    }
    const pesquisador = await carregarPesquisador(req, res);
    if (!pesquisador) return undefined;

    const lista = montarLista(pesquisador);
    const resumo = regras.calcularResumo({
      itens: lista.itens,
      formaPagamento,
      parceiro: pesquisador.parceiro
    });
    return res.status(200).json({ formaPagamento, parceiro: pesquisador.parceiro, ...resumo });
  })
);

// Adicionar amostra à lista (Regra 2: precisa ter alíquotas disponíveis)
router.post(
  '/itens',
  asyncHandler(async (req, res) => {
    const { amostraId } = req.body || {};
    const quantidade = req.body && req.body.quantidade !== undefined ? req.body.quantidade : 1;

    if (!amostraId || !mongoose.isValidObjectId(amostraId)) {
      return res.status(400).json({ erro: 'Informe um amostraId válido' });
    }
    if (!Number.isInteger(quantidade) || quantidade < 1) {
      return res.status(400).json({ erro: 'quantidade deve ser um número inteiro maior que zero' });
    }

    const amostra = await Amostra.findById(amostraId);
    if (!amostra) return res.status(404).json({ erro: 'Amostra não encontrada' });

    const pesquisador = await carregarPesquisador(req, res);
    if (!pesquisador) return undefined;

    const itemExistente = pesquisador.lista.find((item) => item.amostra._id.equals(amostra._id));
    const jaNaLista = itemExistente ? itemExistente.quantidade : 0;

    const disponibilidade = regras.verificarDisponibilidade(amostra.estoque, jaNaLista, quantidade);
    if (!disponibilidade.ok) {
      return res.status(422).json({ erro: disponibilidade.motivo });
    }

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      pesquisador.lista.push({ amostra: amostra._id, quantidade });
    }
    await pesquisador.save();
    await pesquisador.populate('lista.amostra');

    return res.status(201).json(montarLista(pesquisador));
  })
);

// Remover uma amostra da lista
router.delete(
  '/itens/:amostraId',
  asyncHandler(async (req, res) => {
    const pesquisador = await carregarPesquisador(req, res);
    if (!pesquisador) return undefined;

    const antes = pesquisador.lista.length;
    pesquisador.lista = pesquisador.lista.filter(
      (item) => item.amostra._id.toString() !== req.params.amostraId
    );
    if (pesquisador.lista.length === antes) {
      return res.status(404).json({ erro: 'Esta amostra não está na sua lista' });
    }
    await pesquisador.save();
    await pesquisador.populate('lista.amostra');
    return res.status(200).json(montarLista(pesquisador));
  })
);

// Esvaziar a lista
router.delete(
  '/',
  asyncHandler(async (req, res) => {
    await Pesquisador.updateOne({ _id: req.pesquisadorId }, { $set: { lista: [] } });
    res.status(204).send();
  })
);

module.exports = router;
