const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const VALID_KEYS = ['32239105688', '29672507957', '12550915154'];

const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;

const crypto = require('crypto');

function generateSignature(params, secret) {
  const orderedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

app.post('/place-order', async (req, res) => {
  try {
    const body = req.body;
    const { license, category, symbol, side, orderType, qty, takeProfit, stopLoss, timeInForce } = body;

    if (!VALID_KEYS.includes(license)) {
      return res.status(403).json({ error: 'Invalid license key' });
    }

    const timestamp = Date.now().toString();
    const recvWindow = 5000;

    const params = {
      api_key: API_KEY,
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

    const sign = generateSignature(params, API_SECRET);
    const fullParams = { ...params, sign };

    const result = await axios.post(
      'https://api-testnet.bybit.com/v5/order/create',
      null,
      { params: fullParams }
    );

    res.json(result.data);

  } catch (err) {
    console.error('Order error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Order failed', details: err.response?.data || err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Backend running on port 3000');
});
