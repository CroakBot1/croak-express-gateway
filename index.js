require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const BASE_URL = 'https://api.bybit.com'; // Live Bybit Mainnet

function generateSignature(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const query = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHmac('sha256', apiSecret).update(query).digest('hex');
}

app.post('/place-order', async (req, res) => {
  const { side, qty, tp, sl, symbol = 'ETHUSDT' } = req.body;
  const apiKey = process.env.BYBIT_API_KEY;
  const apiSecret = process.env.BYBIT_API_SECRET;
  const timestamp = Date.now();

  const params = {
    category: 'linear',
    symbol,
    side,
    orderType: 'Market',
    qty,
    timeInForce: 'GoodTillCancel',
    takeProfit: tp,
    stopLoss: sl,
    apiKey,
    recvWindow: 5000,
    timestamp
  };

  const sign = generateSignature(params, apiSecret);
  const queryParams = { ...params, sign };

  try {
    const response = await axios.post(`${BASE_URL}/v5/order/create`, null, {
      params: queryParams,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: '❌ Order failed',
      error: error.response?.data || error.message
    });
  }
});

app.listen(3000, () => console.log('✅ Croak Backend Live on PORT 3000'));
