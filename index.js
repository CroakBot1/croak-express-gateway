const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const app = express();
app.use(express.json());

// Hardcoded valid key + secret for testing
const BYBIT_API_KEY = '4V7w7VSkgk8qVJ5YTq';
const BYBIT_SECRET = 'lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Fix CORS
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/place-order', async (req, res) => {
  try {
    const { symbol, side, qty } = req.body;
    const timestamp = Date.now().toString();
    const recvWindow = 5000;

    const paramsObj = {
      apiKey: BYBIT_API_KEY,
      symbol,
      side,
      qty,
      timestamp,
      recvWindow
    };

    const orderedParams = Object.entries(paramsObj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    const signature = crypto.createHmac('sha256', BYBIT_SECRET)
      .update(orderedParams)
      .digest('hex');

    const headers = {
      'Content-Type': 'application/json'
    };

    const response = await axios.post(
      'https://api-testnet.bybit.com/v5/order/create',
      { ...paramsObj, sign: signature },
      { headers }
    );

    res.json(response.data);
  } catch (err) {
    console.error('❌ Order Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Order failed', details: err.message });
  }
});

app.listen(10000, () => console.log('🚀 Server running on port 10000'));
