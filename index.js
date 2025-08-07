const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to receive buy/sell signals from frontend
app.post('/signal', async (req, res) => {
  const { action } = req.body;

  if (!['buy', 'sell'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action.' });
  }

  try {
    // Example: send order to Bybit
    const result = await axios.post('https://api.bybit.com/v5/order/create', {
      category: 'linear',
      symbol: 'ETHUSDT',
      side: action.toUpperCase(),
      orderType: 'Market',
      qty: 0.01,
      timeInForce: 'GoodTillCancel',
      apiKey: process.env.BYBIT_API_KEY,
      // Add signature and secret logic if needed here
    });

    res.json({ message: `${action} order sent`, result: result.data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Order failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Backend running on port ${PORT}`);
});
