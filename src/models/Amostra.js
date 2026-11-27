const mongoose = require('mongoose');

const amostraSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    especie: { type: String, required: true },
    tipo: { type: String, required: true },
    descricao: { type: String, default: '' },
    armazenamento: { type: String, required: true },
    taxaProcessamento: { type: Number, required: true, min: 0 },
    estoque: { type: Number, required: true, min: 0 } // alíquotas disponíveis
  },
  { timestamps: true }
);

amostraSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Amostra', amostraSchema);
