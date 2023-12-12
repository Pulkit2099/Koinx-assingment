// historicalPriceModel.js
const mongoose = require('mongoose');

const historicalPriceSchema = new mongoose.Schema({
  fromCurrency: String,
  toCurrency: String,
  date: Date,
  price: Number,
});

const HistoricalPrice = mongoose.model('HistoricalPrice', historicalPriceSchema);

module.exports = HistoricalPrice;
