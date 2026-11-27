const mongoose = require('mongoose');

const itemSolicitacaoSchema = new mongoose.Schema(
  {
    amostra: { type: mongoose.Schema.Types.ObjectId, ref: 'Amostra', required: true },
    codigo: String,
    nome: String,
    quantidade: Number,
    taxaUnitaria: Number
  },
  { _id: false }
);

const solicitacaoSchema = new mongoose.Schema(
  {
    pesquisador: { type: mongoose.Schema.Types.ObjectId, ref: 'Pesquisador', required: true },
    itens: { type: [itemSolicitacaoSchema], required: true },
    formaPagamento: { type: String, enum: ['pix', 'cartao', 'boleto'], required: true },
    enderecoEntrega: { type: String, required: true },
    subtotal: Number,
    desconto: Number,
    transporte: Number,
    total: Number,
    transporteGratis: Boolean,
    status: { type: String, default: 'confirmada' }
  },
  { timestamps: true }
);

solicitacaoSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.pesquisador = ret.pesquisador.toString();
    ret.itens = ret.itens.map((item) => ({ ...item, amostra: item.amostra.toString() }));
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Solicitacao', solicitacaoSchema);
