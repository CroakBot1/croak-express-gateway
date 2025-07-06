// == CROAK EXPRESS GATEWAY - FULL FIXED BACKEND ✅ ==
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// === 🔐 Replace with YOUR real Bybit Testnet API credentials ===
const API_KEY = '4V7w7VSkgk8qVJ5YTq';
const API_SECRET = 'lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ';
const BASE_URL = 'https://api-testnet.bybit.com';

// === 🔐 List of Valid License Keys ===
const VALID_LICENSES = ['32239105688', '29672507957', '12550915154'];

// === 🔒 Signature generator
function generateSignature(params, secret) {
  const ordered = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key];
    return acc;
  }, {});
  const query = Object.entries(ordered).map(([k, v]) => `${k}=${v}`).join('&');
  return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

// === 📦 Place Order Endpoint
app.post('/place-order', async (req, res) => {
  const { category, symbol, side, orderType, qty, takeProfit, stopLoss, timeInForce, license } = req.body;

  // ✅ Check License
  if (!VALID_LICENSES.includes(license)) {
    return res.status(403).json({ error: '❌ Invalid License Key. Access Denied.' });
  }

  try {
    const timestamp = Date.now().toString();
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
      recvWindow: 5000
    };

    const sign = generateSignature(params, API_SECRET);
    const payload = { ...params, sign };

    const response = await fetch(`${BASE_URL}/v5/order/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("📦 ORDER PAYLOAD:", payload);
    console.log("✅ BYBIT RESPONSE:", data);
    res.json(data);
  } catch (err) {
    console.error('❌ Order Failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🟢 Croak Gateway running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
