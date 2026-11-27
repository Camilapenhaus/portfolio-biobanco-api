const crypto = require('crypto');
const mongoose = require('mongoose');

const itemListaSchema = new mongoose.Schema(
  {
    amostra: { type: mongoose.Schema.Types.ObjectId, ref: 'Amostra', required: true },
    quantidade: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const pesquisadorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    instituicao: { type: String, required: true, trim: true },
    senhaHash: { type: String, required: true },
    salt: { type: String, required: true },
    parceiro: { type: Boolean, default: false },
    totalGasto: { type: Number, default: 0 },
    lista: { type: [itemListaSchema], default: [] } // "carrinho" de amostras
  },
  { timestamps: true }
);

pesquisadorSchema.methods.definirSenha = function definirSenha(senha) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.senhaHash = crypto.scryptSync(senha, this.salt, 64).toString('hex');
};

pesquisadorSchema.methods.senhaConfere = function senhaConfere(senha) {
  const hash = crypto.scryptSync(senha, this.salt, 64);
  return crypto.timingSafeEqual(hash, Buffer.from(this.senhaHash, 'hex'));
};

pesquisadorSchema.methods.perfil = function perfil() {
  return {
    id: this._id.toString(),
    nome: this.nome,
    email: this.email,
    instituicao: this.instituicao,
    parceiro: this.parceiro,
    totalGasto: this.totalGasto
  };
};

module.exports = mongoose.model('Pesquisador', pesquisadorSchema);
