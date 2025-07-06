const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const port = 10000;

app.use(bodyParser.json());

const API_KEY = '4V7w7VSkgk8qVJ5YTq';
const API_SECRET = 'lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ';

function genSignature(query, timestamp) {
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(`${timestamp}${API_KEY}10000${query}`)
    .digest('hex');
}

app.post('/place-order', async (req, res) => {
  const order = req.body;

  const url = 'https://api.bybit.com/v5/order/create';
  const timestamp = Date.now().toString();

  const payload = {
    category: order.category,
    symbol: order.symbol,
    side: order.side,
    orderType: order.orderType,
    qty: order.qty,
    takeProfit: order.takeProfit,
    stopLoss: order.stopLoss,
    timeInForce: order.timeInForce
  };

  const query = new URLSearchParams(payload).toString();
  const signature = genSignature(query, timestamp);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-BAPI-API-KEY': API_KEY,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': '10000',
        'X-BAPI-SIGN': signature,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
