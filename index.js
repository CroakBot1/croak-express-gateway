const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const ORDER_URL = process.env.ORDER_URL || 'https://api-testnet.bybit.com/v5/order/create';

// 🧠 Signature Generator
function generateSignature(secret, params) {
  const orderedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

// 🛒 Place Order Handler
app.post('/place-order', async (req, res) => {
  const {
    category, symbol, side, orderType,
    qty, takeProfit, stopLoss, timeInForce
  } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = '5000';

  // ⚙️ Core Params
  const params = {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce,
    apiKey: API_KEY, // ✅ CORRECT KEY NAME
    timestamp,
    recvWindow
  };

  // 🔐 Generate Signature
  const signature = generateSignature(API_SECRET, params);

  // 📦 Final Payload
  const payload = {
    ...params,
    sign: signature
  };

  console.log('📤 Sending to Bybit:', payload);

  try {
    const response = await fetch(ORDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BYBIT-API-KEY': API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('✅ Bybit Response:', data);
    res.json(data);
  } catch (err) {
    console.error('❌ Order Failed:', err.message);
    res.status(500).json({ error: 'Order failed', detail: err.message });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway V5 Live at http://localhost:${PORT}`);
});
