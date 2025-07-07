const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.BYBIT_API_KEY || '4V7w7VSkgk8qVJ5YTq';
const API_SECRET = process.env.BYBIT_API_SECRET || 'lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ';

// 🔐 Generate Signature
function sign(secret, params) {
  const ordered = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHmac('sha256', secret).update(ordered).digest('hex');
}

// 🟢 Place Order Endpoint
app.post('/place-order', async (req, res) => {
  const { symbol, side, orderType, qty, takeProfit, stopLoss, timeInForce = "IOC", category = "linear" } = req.body;
  const timestamp = Date.now().toString();
  const recvWindow = "5000";

  const params = {
    apiKey: API_KEY,
    category,
    symbol,
    side,
    orderType,
    qty,
    timeInForce,
    takeProfit,
    stopLoss,
    timestamp,
    recvWindow
  };

  // Remove undefined/null
  Object.keys(params).forEach(k => {
    if (!params[k]) delete params[k];
  });

  const signature = sign(API_SECRET, params);
  const url = 'https://api-testnet.bybit.com/v5/order/create';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, sign: signature })
    });

    const data = await response.json();
    console.log("✅ ORDER RESPONSE:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json({ error: "Order failed", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
