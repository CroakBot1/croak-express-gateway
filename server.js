const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
app.use(cors()); // ✅ Fixes CORS for all origins
app.use(express.json());

const API_KEY = process.env.API_KEY || '4V7w7VSkgk8qVJ5YTq';
const API_SECRET = process.env.API_SECRET || 'lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ';

app.post('/place-order', async (req, res) => {
  const {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce,
    license
  } = req.body;

  const timestamp = Date.now().toString();

  const params = {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce
  };

  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(`${timestamp}${API_KEY}${query}`)
    .digest('hex');

  try {
    const result = await fetch('https://api.bybit.com/v5/order/create', {
      method: 'POST',
      headers: {
        'X-BYBIT-API-KEY': API_KEY,
        'X-BYBIT-API-SIGN': signature,
        'X-BYBIT-API-TIMESTAMP': timestamp,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Trade failed', details: err.message });
  }
});

module.exports = app;
