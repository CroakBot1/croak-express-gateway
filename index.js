require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { RestClientV5 } = require('bybit-api');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// ✅ BYBIT FUTURES CLIENT INIT
const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: process.env.USE_TESTNET === 'true',
});

// ✅ TRADE FUNCTION
async function placeOrder(signal) {
  try {
    const side = signal.toUpperCase(); // BUY or SELL
    const response = await client.submitOrder({
      category: 'linear',
      symbol: 'ETHUSDT',
      side: side,
      orderType: 'Market',
      qty: '0.01', // ⚠️ Change to desired qty
      timeInForce: 'GoodTillCancel',
    });

    console.log(`${side} order placed`, response);
    return response;
  } catch (err) {
    console.error(`Error placing ${signal} order:`, err);
    throw err;
  }
}

// ✅ SIGNAL ENDPOINT
app.post('/signal', async (req, res) => {
  const { signal } = req.body;

  if (!signal || !['buy', 'sell'].includes(signal.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid signal' });
  }

  try {
    const result = await placeOrder(signal);
    res.json({ status: 'Order executed', result });
  } catch (error) {
    res.status(500).json({ error: 'Order failed', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Bot listening on http://localhost:${port}`);
});
