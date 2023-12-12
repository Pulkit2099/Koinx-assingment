const express = require('express');
const axios = require('axios');
const HistoricalPrice = require('../models/historicalPriceModel');

const router = express.Router();
router.use(express.json());

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

router.post('/crypto_price', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, date } = req.body;

    // Convert date to timestamp
    const dateResponse = await axios.get(`${COINGECKO_API_BASE}/coins/bitcoin/market_chart/range`, {
      params: { vs_currency: toCurrency, from: date, to: date }
    });

    const datePrices = dateResponse.data.prices;

    if (!datePrices || datePrices.length === 0) {
      return res.status(404).json({ error: 'Timestamp not available for the given date' });
    }

    const timestamp = datePrices[0]?.[0] / 1000;

    if (!timestamp) {
      return res.status(404).json({ error: 'Timestamp not available for the given date' });
    }

    console.log('Coingecko API Response for Date Conversion:', dateResponse.data);

    // Fetch prices from Coingecko API
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/${fromCurrency}/market_chart/range`, {
      params: { vs_currency: toCurrency, from: timestamp, to: timestamp }
    });

    const historicalPrices = response.data.prices;

    if (!historicalPrices || historicalPrices.length === 0) {
      return res.status(404).json({ error: 'Price data not available for the given date' });
    }

    console.log('Coingecko API Response for Historical Prices:', response.data);

    const price = historicalPrices[0]?.[1];

    if (!price) {
      return res.status(404).json({ error: 'Price data not available for the given date' });
    }

    // Save historical price to MongoDB
    await HistoricalPrice.create({
      fromCurrency,
      toCurrency,
      date: new Date(timestamp * 1000),
      price,
    });

    res.json({ price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
