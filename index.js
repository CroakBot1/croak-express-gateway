// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { WebsocketClient, RestClientV5 } = require('bybit-api');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Setup Bybit API client (USDT Perpetual)
const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

// Simple protection
const VALID_PASSWORD = process.env.SIGNAL_PASSWORD || 'croak123';

// Route to receive trade signals
app.post('/trade', async (req, res) => {
  const { action, symbol, qty, password } = req.body;

  if (password !== VALID_PASSWORD) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (!['buy', 'sell'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action' });
  }

  try {
    const side = action.toUpperCase();

    const result = await client.submitOrder({
      category: 'linear',
      symbol: symbol || 'ETHUSDT',
      side,
      orderType: 'Market',
      qty: qty || '0.01',
      timeInForce: 'GoodTillCancel',
    });

    console.log(`✅ ${side} order placed`, result);
    res.json({ success: true, message: `✅ ${side} order placed`, result });
  } catch (err) {
    console.error('❌ Order error:', err);
    res.status(500).json({ success: false, message: '❌ Order failed', error: err });
  }
});

app.get('/', (req, res) => {
  res.send('Croak Express Gateway Live 🐸');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
