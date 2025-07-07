const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ HARDCODED CONFIG
const API_KEY = 'Dpej60QT5fbbPSi5CK';
const API_SECRET = 'aKHo0yLqiYqXnkYhQDOdGhG2kJnogEh4vSeo';
const ORDER_URL = 'https://api-testnet.bybit.com/v5/order/create';
const PORT = 10000;

function generateSignature(secret, params) {
  const orderedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

app.post('/place-order', async (req, res) => {
  const {
    category, symbol, side, orderType,
    qty, takeProfit, stopLoss, timeInForce
  } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = '5000';

  const params = {
    category, symbol, side, orderType,
    qty, takeProfit, stopLoss, timeInForce
  };

  const baseParams = {
    ...params,
    timestamp,
    recvWindow
  };

  const signature = generateSignature(API_SECRET, {
    ...baseParams,
    apiKey: API_KEY
  });

  try {
    const response = await fetch(ORDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BYBIT-API-KEY': API_KEY
      },
      body: JSON.stringify({
        ...baseParams,
        sign: signature
      })
    });

    const data = await response.json();
    console.log('✅ Order Response:', data);
    res.json(data);
  } catch (err) {
    console.error('❌ Order error:', err);
    res.status(500).json({ error: 'Order failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Croak Express Gateway live on port ${PORT}`);
});
