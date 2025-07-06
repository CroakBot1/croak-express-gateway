// == FULL FIX BACKEND (HARDCODED TESTING) 🧠🐸 ==
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors()); // ✅ Enable CORS
app.use(express.json());

// 🔐 HARDCODED KEYS for testing (Replace with .env later)
const BYBIT_API_KEY = '4V7w7VSkgk8qVJ5YTq';
const BYBIT_SECRET = 'lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ';

// ✅ Main Order Endpoint
app.post('/place-order', async (req, res) => {
  try {
    const { symbol, side, qty } = req.body;
    const timestamp = Date.now().toString();

    const paramsObj = {
      api_key: BYBIT_API_KEY,
      symbol,
      side,
      qty,
      timestamp
    };

    const paramStr = Object.keys(paramsObj)
      .sort()
      .map(key => `${key}=${paramsObj[key]}`)
      .join('&');

    const signature = crypto
      .createHmac('sha256', BYBIT_SECRET)
      .update(paramStr)
      .digest('hex');

    const fullParams = {
      ...paramsObj,
      sign: signature
    };

    const response = await axios.post(
      'https://api.bybit.com/v5/order/create',
      fullParams
    );

    res.json(response.data);
  } catch (err) {
    console.error('❌ Order Error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Order failed',
      details: err?.response?.data || err.message
    });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
