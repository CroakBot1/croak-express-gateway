const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/ping', (req, res) => res.send('✅ Backend is LIVE with hardcoded API key'));

app.post('/place-order', async (req, res) => {
  const {
    category, symbol, side, orderType,
    qty, takeProfit, stopLoss, timeInForce
  } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = '5000';

  const params = {
    category, symbol, side, orderType,
    qty, takeProfit, stopLoss, timeInForce,
    apiKey: API_KEY,
    timestamp,
    recvWindow
  };

  const signature = generateSignature(API_SECRET, params);
  const payload = { ...params, sign: signature };

  // ✅ DEBUG LOGGING
  console.log('🧩 API_KEY:', API_KEY);
  console.log('🧩 Params:', params);
  console.log('🧩 Signature:', signature);
  console.log('📤 Final Payload:', payload);

  try {
    const response = await fetch(ORDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('✅ Order Response:', data);
    res.json(data);
  } catch (err) {
    console.error('❌ Error placing order:', err);
    res.status(500).json({ error: 'Order failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Croak Express Gateway live on port ${PORT}`);
});
