const express = require('express');
const mongoose = require('mongoose');
const cryptoRoutes = require('./routes/cryptoList');
const bodyParser=require('body-parser')
const historicalPriceRoutes = require('./routes/PriceList');

const app = express();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// MongoDB setup
mongoose.connect('mongodb+srv://pulkit:123@cluster0.xofh23l.mongodb.net/new?retryWrites=true');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use('/crypto', cryptoRoutes);
app.use('/historical', historicalPriceRoutes);







// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
