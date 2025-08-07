const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;

async function placeOrder(side) {
  const timestamp = Date.now().toString();
  const recvWindow = '5000';
  const symbol = 'ETHUSDT';
  const qty = '0.01';
  const price = ''; // For market order, price is not required

  const params = new URLSearchParams({
    category: 'linear',
    symbol,
    side: side.toUpperCase(),
    orderType: 'Market',
    qty,
    timestamp,
    recvWindow
  });

  const signature = crypto.createHmac('sha256', API_SECRET)
    .update(params.toString())
    .digest('hex');

  const headers = {
    'X-BYBIT-API-KEY': API_KEY,
    'X-BYBIT-SIGN': signature
  };

  try {
    const res = await axios.post('https://api.bybit.com/v5/order/create', null, {
      params,
      headers
    });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
}

app.post('/signal', async (req, res) => {
  const { action } = req.body;
  if (!['buy', 'sell'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const result = await placeOrder(action);
  if (result.success) {
    res.json({ message: `Trade ${action.toUpperCase()} executed.` });
  } else {
    res.status(500).json({ message: 'Trade failed', error: result.error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🧠 Backend running on ${PORT}`));
