const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Homepage
app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway is LIVE and connected to CROAK BOT 61k+');
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

// ✅ Trade (Bybit Testnet)
app.post('/trade', async (req, res) => {
  const { side, qty, apiKey, apiSecret } = req.body;
  const timestamp = Date.now();
  const crypto = require('crypto');

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

// ✅ Save Memory to Server
app.post('/save-memory', (req, res) => {
  try {
    fs.writeFileSync('memory.json', JSON.stringify(req.body, null, 2));
    res.json({ status: 'ok', message: 'Memory saved to backend.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save memory', details: err.message });
  }
});

// ✅ Load Memory from Server
app.get('/load-memory', (req, res) => {
  try {
    if (fs.existsSync('memory.json')) {
      const data = fs.readFileSync('memory.json', 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'No memory file found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to load memory', details: err.message });
  }
});

// ✅ Status Checker
app.get('/status', (req, res) => {
  res.json({ status: 'ok', connected: true, time: new Date().toISOString() });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway running on http://localhost:${PORT}`);
});
