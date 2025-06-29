const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Allow any frontend access
app.use(cors());

// Welcome
app.get('/', (req, res) => {
  res.send('🐸 Croak Express Gateway is LIVE!');
});

// Status check endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'OK', service: 'croak-express-gateway', timestamp: new Date() });
});

// ETH Price Endpoint
app.get('/price', async (req, res) => {
  try {
    const response = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
    const price = response.data.result[0].last_price;
    res.json({ symbol: 'ETHUSDT', price });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ETH price' });
  }
});

// BTC Price Endpoint
app.get('/btcprice', async (req, res) => {
  try {
    const response = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=BTCUSDT');
    const price = response.data.result[0].last_price;
    res.json({ symbol: 'BTCUSDT', price });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway running on port ${PORT}`);
});
