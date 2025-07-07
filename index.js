const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ HARD-CODED KEYS & CONFIG
const API_KEY = 'Dpej60QT5fbbPSi5CK';
const API_SECRET = 'aKHo0yLqiYqXnkYhQDOdGhG2kJnogEh4vSeo';
const ORDER_URL = 'https://api-testnet.bybit.com/v5/order/create';
const PORT = 10000;

// ✅ SIGNATURE GENERATOR
function generateSignature(secret, params) {
  const orderedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

// ✅ MAIN ORDER ROUTE
app.post('/place-order', async (req, res) => {
  const {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce
  } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = '5000';

  const params = {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce,
    apiKey: API_KEY,
    timestamp,
    recvWindow
  };

  const signature = generateSignature(API_SECRET, params);

  try {
    const response = await fetch(ORDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, sign: signature })
    });

    const data = await response.json();
    console.log('✅ Order Response:', data);
    res.json(data);
  } catch (err) {
    console.error('❌ Order Error:', err);
    res.status(500).json({ error: 'Order failed', detail: err.message });
  }
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Croak Express Gateway live on port ${PORT}`);
});
