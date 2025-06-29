const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ Homepage
app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway is LIVE and linked to CROAK BOT 61k');
});

// ✅ ETH Price
app.get('/price', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
    const price = data.result[0].last_price;
    res.json({ pair: 'ETHUSDT', price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ETH price' });
  }
});

// ✅ BTC Price
app.get('/btcprice', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=BTCUSDT');
    const price = data.result[0].last_price;
    res.json({ pair: 'BTCUSDT', price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
});

// ✅ Status Checker
app.get('/status', (req, res) => {
  res.json({ status: 'ok', connected: true, time: new Date().toISOString() });
});

// ✅ Start
app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway running on http://localhost:${PORT}`);
});
