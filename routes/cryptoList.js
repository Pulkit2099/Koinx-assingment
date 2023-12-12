// cryptoRoutes.js
const express = require('express');
const axios = require('axios');
const Crypto = require('../models/cryptoModel');

const router = express.Router();

const updateCryptoListTask = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    const cryptoList = response.data.map(({ name, id }) => ({ name, id }));

    await Crypto.deleteMany({});
    await Crypto.insertMany(cryptoList);
    console.log('Crypto list updated successfully.');
  } catch (error) {
    console.error('Error updating crypto list:', error);
  }
};

setInterval(updateCryptoListTask, 3600000);

router.get('/cryptoList', async (req, res) => {
  try {
    const cryptoList = await Crypto.find({}, 'name id -_id');

    if (!cryptoList || cryptoList.length === 0) {
      return res.status(404).json({ error: 'Crypto list not found' });
    }

    return res.json(cryptoList);
  } catch (error) {
    console.error('Error getting crypto list:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
