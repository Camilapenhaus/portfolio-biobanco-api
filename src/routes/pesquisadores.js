const express = require('express');
const Pesquisador = require('../models/Pesquisador');
const { exigirLogin } = require('../middlewares/autenticacao');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

// Perfil do pesquisador logado (mostra se é Parceiro e quanto já gastou)
router.get(
  '/me',
  exigirLogin,
  asyncHandler(async (req, res) => {
    const pesquisador = await Pesquisador.findById(req.pesquisadorId);
    if (!pesquisador) return res.status(401).json({ erro: 'Pesquisador do token não existe mais' });
    return res.status(200).json(pesquisador.perfil());
  })
);

module.exports = router;
