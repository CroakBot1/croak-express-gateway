const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Homepage
app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway is LIVE and connected to CROAK BOT 61k');
});

// ✅ ETH Price - v5 API
app.get('/price', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.bybit.com/v5/market/tickers?category=linear&symbol=ETHUSDT');
    const price = data.result.list[0].lastPrice;
    res.json({ pair: 'ETHUSDT', price });
  } catch (err) {
    console.error('❌ ETH PRICE ERROR:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch ETH price', details: err.message });
  }
});

// ✅ BTC Price - v5 API
app.get('/btcprice', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.bybit.com/v5/market/tickers?category=linear&symbol=BTCUSDT');
    const price = data.result.list[0].lastPrice;
    res.json({ pair: 'BTCUSDT', price });
  } catch (err) {
    console.error('❌ BTC PRICE ERROR:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch BTC price', details: err.message });
  }
});

// ✅ Trade endpoint (Bybit Testnet)
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
    console.error('❌ TRADE ERROR:', err.response?.data || err.message);
    res.status(500).json({ error: 'Trade failed', details: err.message });
  }
});

// ✅ Status
app.get('/status', (req, res) => {
  res.json({ status: 'ok', connected: true, time: new Date().toISOString() });
});

// ✅ Start
app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway running on http://localhost:${PORT}`);
});
