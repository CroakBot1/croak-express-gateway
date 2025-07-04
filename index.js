const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ Croak Bot Backend is Live!');
});

app.get('/fetch-balance', async (req, res) => {
  try {
    // Replace this with actual fetch logic if needed
    return res.json({ usdt: 981 });
  } catch (err) {
    console.error('Balance error:', err.message);
    return res.status(500).json({ error: 'Balance fetch failed' });
  }
});

app.get('/fetch-positions', async (req, res) => {
  try {
    // Replace this with actual positions logic if needed
    return res.json([
      { symbol: 'ETHUSDT', size: 0.1, side: 'Buy', entry: 2960 }
    ]);
  } catch (err) {
    console.error('Position error:', err.message);
    return res.status(500).json({ error: 'Positions fetch failed' });
  }
});

app.post('/place-order', async (req, res) => {
  try {
    const { side, qty, tp, sl } = req.body;
    console.log(`Order received: ${side} ${qty}ETH TP:${tp} SL:${sl}`);

    // Simulated order execution result
    return res.json({ message: 'Order placed successfully', success: true });
  } catch (err) {
    console.error('Order error:', err.message);
    return res.status(500).json({ error: 'Order failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Croak Bot Backend running on port ${PORT}`);
});
