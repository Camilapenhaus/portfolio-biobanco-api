const express = require('express');
const Pesquisador = require('../models/Pesquisador');
const { gerarToken } = require('../middlewares/autenticacao');
const asyncHandler = require('./asyncHandler');

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cadastro de pesquisador
router.post(
  '/cadastro',
  asyncHandler(async (req, res) => {
    const { nome, email, senha, instituicao } = req.body || {};

    if (!nome || !email || !senha || !instituicao) {
      return res
        .status(400)
        .json({ erro: 'Campos obrigatórios: nome, email, senha e instituicao' });
    }
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ erro: 'E-mail em formato inválido' });
    }
    if (typeof senha !== 'string' || senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const existente = await Pesquisador.findOne({ email: email.toLowerCase().trim() });
    if (existente) {
      return res.status(409).json({ erro: 'Já existe um pesquisador com este e-mail' });
    }

    const pesquisador = new Pesquisador({ nome, email, instituicao });
    pesquisador.definirSenha(senha);
    await pesquisador.save();

    return res.status(201).json({
      mensagem: 'Pesquisador cadastrado com sucesso',
      pesquisador: pesquisador.perfil()
    });
  })
);

// Login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, senha } = req.body || {};
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha' });
    }

    const pesquisador = await Pesquisador.findOne({ email: String(email).toLowerCase().trim() });
    if (!pesquisador || !pesquisador.senhaConfere(String(senha))) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
    }

    return res.status(200).json({
      token: gerarToken(pesquisador),
      pesquisador: pesquisador.perfil()
    });
  })
);

module.exports = router;
