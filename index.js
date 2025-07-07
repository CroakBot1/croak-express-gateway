const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

// ✅ Load .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ORDER_URL = process.env.ORDER_URL;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

// ✅ Debug check if keys are actually loaded
console.log("🔐 API_KEY Loaded:", API_KEY ? "[OK]" : "[MISSING]");
console.log("🔐 API_SECRET Loaded:", API_SECRET ? "[OK]" : "[MISSING]");

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
