// cryptoModel.js
const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  name: String,
  id: String,
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;
