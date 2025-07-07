const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ORDER_URL = process.env.ORDER_URL;

function generateSignature(secret, params) {
  const orderedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

app.post('/place-order', async (req, res) => {
  const { category, symbol, side, orderType, qty, takeProfit, stopLoss, timeInForce } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = "5000";

  const params = {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce,
    timestamp,
    recvWindow
  };

  const signature = generateSignature(process.env.API_SECRET, {
    ...params,
    apiKey: process.env.API_KEY
  });

  try {
    const response = await fetch(ORDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BYBIT-API-KEY': process.env.API_KEY,
        'X-BYBIT-SIGNATURE': signature,
        'X-BYBIT-TIMESTAMP': timestamp,
        'X-BYBIT-RECV-WINDOW': recvWindow
      },
      body: JSON.stringify(params)
    });

    const data = await response.json();
    console.log("✅ Order Response:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ error: "Order failed", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Croak Express Gateway live on port ${PORT}`);
});
