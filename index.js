// == CROAK EXPRESS GATEWAY FINAL 🐸🚀 ==
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ORDER_URL = process.env.ORDER_URL; // Should be https://api.bybit.com/v5/order/create or testnet

// 🔐 Signature Generator
function generateSignature(secret, params) {
  const orderedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

// ✅ Place Order Endpoint
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
    apiKey: process.env.API_KEY,
    recvWindow
  };

  const signature = generateSignature(process.env.API_SECRET, params);

  try {
    const response = await fetch(ORDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BYBIT-API-KEY': process.env.API_KEY // ✅ Required header!
      },
      body: JSON.stringify({ ...params, sign: signature })
    });

    const data = await response.json();
    console.log("✅ Order Response:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ error: "Order failed", detail: err.message });
  }
});

// ✅ Server Start
app.listen(PORT, () => {
  console.log(`🚀 Croak Express Gateway live on port ${PORT}`);
});
