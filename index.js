// == CROAK EXPRESS GATEWAY – FULL FIX FINAL 🐸🚀 ==
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ✅ Valid License Keys
const VALID_KEYS = ['32239105688', '29672507957', '12550915154'];

// 🔐 Signature Generator
function generateSignature(params, secret) {
  const orderedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

// 🚀 Trade Order Endpoint
app.post('/place-order', async (req, res) => {
  try {
    const {
      license,
      category,
      symbol,
      side,
      orderType,
      qty,
      takeProfit,
      stopLoss,
      timeInForce
    } = req.body;

    // ✅ Validate license
    if (!VALID_KEYS.includes(license)) {
      return res.status(403).json({ error: 'Invalid license key' });
    }

    const timestamp = Date.now().toString();
    const recvWindow = "5000";

    const params = {
      api_key: process.env.BYBIT_API_KEY,
      timestamp,
      recvWindow,
      category,
      symbol,
      side,
      orderType,
      qty,
      takeProfit,
      stopLoss,
      timeInForce
    };

    // 🔐 Create signature
    const sign = generateSignature(params, process.env.BYBIT_API_SECRET);
    const fullParams = { ...params, sign };

    // 📤 Send order request to Bybit
    const response = await axios.post(
      'https://api-testnet.bybit.com/v5/order/create',
      null,
      { params: fullParams }
    );

    console.log("✅ Order Response:", response.data);
    res.json(response.data);

  } catch (err) {
    console.error("❌ Order Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Order failed", detail: err.response?.data || err.message });
  }
});

// 🔊 Start server
app.listen(PORT, () => {
  console.log(`🚀 Croak Backend running on port ${PORT}`);
});
