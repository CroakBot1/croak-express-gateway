
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Home
app.get('/', (req, res) => {
  res.send('✅ Croak Gateway LIVE with Memory Sync');
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

// ✅ Trade Endpoint
app.post('/trade', async (req, res) => {
  const { side, qty, apiKey, apiSecret } = req.body;
  const timestamp = Date.now();

  const params = {
    api_key: apiKey,
    symbol: 'ETHUSDT',
    side,
    order_type: 'Market',
    qty,
    time_in_force: 'GoodTillCancel',
    timestamp
  };

  const paramStr = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const sign = crypto.createHmac('sha256', apiSecret).update(paramStr).digest('hex');

  try {
    const { data } = await axios.post(
      'https://api-testnet.bybit.com/v2/private/order/create',
      new URLSearchParams({ ...params, sign }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.json({ status: 'success', result: data });
  } catch (err) {
    res.status(500).json({ error: 'Trade failed', details: err.message });
  }
});

// ✅ Load memory.json
app.get('/memory', (req, res) => {
  fs.readFile('./memory.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read memory' });
    res.json(JSON.parse(data));
  });
});

// ✅ Save to memory.json
app.post('/memory', (req, res) => {
  fs.writeFile('./memory.json', JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to save memory' });
    res.json({ status: 'Memory saved successfully' });
  });
});

// ✅ Status
app.get('/status', (req, res) => {
  res.json({ status: 'ok', connected: true, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway running on http://localhost:${PORT}`);
});
