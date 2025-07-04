const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ======= CONFIGURE YOUR API KEYS HERE ==========
const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;
const BASE_URL = 'https://api-testnet.bybit.com'; // change to https://api.bybit.com for mainnet
// ===============================================

// === UTILITY: Signature Generator for V5 ===
function generateSignature(params, secret) {
  const orderedParams = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key];
    return acc;
  }, {});
  const queryString = Object.entries(orderedParams).map(([k, v]) => `${k}=${v}`).join('&');
  return crypto.createHmac('sha256', secret).update(queryString).digest('hex');
}

// === POST /place-order ===
app.post('/place-order', async (req, res) => {
  const { symbol, side, qty, price, license } = req.body;

  if (!symbol || !side || !qty || !price) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  try {
    const timestamp = Date.now().toString();
    const params = {
      category: 'linear',
      symbol,
      side,
      orderType: 'Limit',
      qty: qty.toString(),
      price: price.toString(),
      timeInForce: 'GTC',
      apiKey: API_KEY,
      timestamp
    };

    const sign = generateSignature(params, API_SECRET);

    const headers = {
      'X-BYBIT-API-KEY': API_KEY,
      'Content-Type': 'application/json'
    };

    const fullPayload = { ...params, sign };

    const response = await axios.post(`${BASE_URL}/v5/order/create`, fullPayload, { headers });

    if (response.data.retCode === 0) {
      return res.json({
        success: true,
        orderId: response.data.result.orderId,
        message: 'Order executed!'
      });
    } else {
      return res.json({
        success: false,
        message: response.data.retMsg || 'Failed to place order'
      });
    }
  } catch (err) {
    console.error('Trade error:', err.message || err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`✅ Croak Backend Live on PORT ${PORT}`);
});
