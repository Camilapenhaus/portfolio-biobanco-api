const express = require('express');
const mongoose = require('mongoose');
const Amostra = require('../models/Amostra');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

// Catálogo público de amostras
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const amostras = await Amostra.find().sort({ codigo: 1 });
    res.status(200).json(amostras);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ erro: 'Id de amostra inválido' });
    }
    const amostra = await Amostra.findById(req.params.id);
    if (!amostra) return res.status(404).json({ erro: 'Amostra não encontrada' });
    return res.status(200).json(amostra);
  })
);

module.exports = router;
