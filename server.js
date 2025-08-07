const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

function generateSignature(payload, secret) {
  const ordered = Object.keys(payload).sort().reduce((obj, key) => {
    obj[key] = payload[key];
    return obj;
  }, {});
  const query = Object.entries(ordered).map(([k, v]) => `${k}=${v}`).join('&');
  return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

app.post('/signal', async (req, res) => {
  const { action } = req.body;

  if (!['buy', 'sell'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action.' });
  }

  const timestamp = Date.now().toString();
  const params = {
    category: 'linear',
    symbol: 'ETHUSDT',
    side: action.toUpperCase(),
    orderType: 'Market',
    qty: '0.01',
    timeInForce: 'GoodTillCancel',
    timestamp,
    recvWindow: '5000'
  };

  const signature = generateSignature(params, process.env.BYBIT_API_SECRET);

  try {
    const result = await axios.post('https://api.bybit.com/v5/order/create', params, {
      headers: {
        'X-BYBIT-API-KEY': process.env.BYBIT_API_KEY,
        'X-BYBIT-SIGN': signature,
        'Content-Type': 'application/json'
      }
    });

    res.json({ message: `${action} order sent`, result: result.data });
  } catch (err) {
    console.error('❌ Error from Bybit:', err.response?.data || err.message);
    res.status(500).json({ error: 'Order failed', details: err.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Backend running on http://localhost:${PORT}`);
});
