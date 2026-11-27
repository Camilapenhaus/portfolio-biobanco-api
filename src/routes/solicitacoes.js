const express = require('express');
const mongoose = require('mongoose');
const Amostra = require('../models/Amostra');
const Pesquisador = require('../models/Pesquisador');
const Solicitacao = require('../models/Solicitacao');
const { exigirLogin } = require('../middlewares/autenticacao');
const regras = require('../services/regras');
const asyncHandler = require('./asyncHandler');

const router = express.Router();
router.use(exigirLogin);

// Finalizar a solicitação de amostras
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { formaPagamento, enderecoEntrega } = req.body || {};

    if (!regras.formaPagamentoValida(formaPagamento)) {
      return res.status(400).json({
        erro: `formaPagamento deve ser uma destas: ${regras.FORMAS_PAGAMENTO.join(', ')}`
      });
    }
    if (!enderecoEntrega || typeof enderecoEntrega !== 'string' || !enderecoEntrega.trim()) {
      return res.status(400).json({ erro: 'Informe o endereço de entrega do laboratório' });
    }

    const pesquisador = await Pesquisador.findById(req.pesquisadorId).populate('lista.amostra');
    if (!pesquisador) return res.status(401).json({ erro: 'Pesquisador do token não existe mais' });

    const lista = pesquisador.lista.filter((item) => item.amostra);
    if (lista.length === 0) {
      return res.status(400).json({ erro: 'Sua lista de solicitação está vazia' });
    }

    // Regra 2 de novo: o estoque pode ter mudado desde que a amostra entrou na lista.
    // A baixa é feita item a item de forma atômica; se algum falhar, desfaz os anteriores.
    const baixados = [];
    for (const item of lista) {
      const atualizado = await Amostra.findOneAndUpdate(
        { _id: item.amostra._id, estoque: { $gte: item.quantidade } },
        { $inc: { estoque: -item.quantidade } },
        { new: true }
      );
      if (!atualizado) {
        for (const desfazer of baixados) {
          await Amostra.updateOne({ _id: desfazer.id }, { $inc: { estoque: desfazer.quantidade } });
        }
        return res.status(422).json({
          erro: `A amostra ${item.amostra.codigo} não tem mais alíquotas suficientes. Atualize sua lista.`
        });
      }
      baixados.push({ id: item.amostra._id, quantidade: item.quantidade });
    }

    const itens = lista.map((item) => ({
      amostra: item.amostra._id,
      codigo: item.amostra.codigo,
      nome: item.amostra.nome,
      quantidade: item.quantidade,
      taxaUnitaria: item.amostra.taxaProcessamento,
      taxaProcessamento: item.amostra.taxaProcessamento
    }));

    // Regras 1 e 3: o benefício de Parceiro vale conforme o status ANTES desta solicitação
    const resumo = regras.calcularResumo({
      itens,
      formaPagamento,
      parceiro: pesquisador.parceiro
    });

    const solicitacao = await Solicitacao.create({
      pesquisador: pesquisador._id,
      itens: itens.map(({ taxaProcessamento, ...resto }) => resto),
      formaPagamento,
      enderecoEntrega: enderecoEntrega.trim(),
      ...resumo
    });

    const eraParceiro = pesquisador.parceiro;
    pesquisador.totalGasto = regras.arredondar(
      pesquisador.totalGasto + regras.valorQueContaParaParceria(resumo)
    );
    if (!pesquisador.parceiro && regras.deveVirarParceiro(pesquisador.totalGasto)) {
      pesquisador.parceiro = true;
    }
    pesquisador.lista = [];
    await pesquisador.save();

    const tornouSeParceiro = !eraParceiro && pesquisador.parceiro;
    return res.status(201).json({
      mensagem: tornouSeParceiro
        ? 'Solicitação confirmada! Você agora é Pesquisador Parceiro e terá transporte grátis nas próximas solicitações.'
        : 'Solicitação confirmada!',
      solicitacao,
      pesquisador: pesquisador.perfil()
    });
  })
);

// Histórico de solicitações do pesquisador logado
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const solicitacoes = await Solicitacao.find({ pesquisador: req.pesquisadorId }).sort({
      createdAt: -1
    });
    res.status(200).json(solicitacoes);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ erro: 'Id de solicitação inválido' });
    }
    const solicitacao = await Solicitacao.findOne({
      _id: req.params.id,
      pesquisador: req.pesquisadorId
    });
    if (!solicitacao) return res.status(404).json({ erro: 'Solicitação não encontrada' });
    return res.status(200).json(solicitacao);
  })
);

module.exports = router;
