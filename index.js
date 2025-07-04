const express = require('express');
const cors = require('cors');
const { RESTClient } = require('bybit-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// === Root Check ===
app.get('/', (req, res) => {
  res.send('🟢 Croak Gateway is Online');
});

// === Fetch Balance ===
app.post('/fetch-balance', async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;
    const client = new RESTClient(apiKey, apiSecret);
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    res.json(result);
  } catch (err) {
    console.error('Balance Fetch Error:', err);
    res.status(500).json({ error: 'Balance fetch failed' });
  }
});

// === Fetch Positions ===
app.post('/fetch-positions', async (req, res) => {
  try {
    const { apiKey, apiSecret, symbol } = req.body;
    const client = new RESTClient(apiKey, apiSecret);
    const result = await client.getPositionInfo({ category: 'linear', symbol });
    res.json(result);
  } catch (err) {
    console.error('Position Fetch Error:', err);
    res.status(500).json({ error: 'Position fetch failed' });
  }
});

// === Execute Trade ===
app.post('/execute-trade', async (req, res) => {
  try {
    const { apiKey, apiSecret, side, symbol, qty, tp, sl } = req.body;
    const client = new RESTClient(apiKey, apiSecret);
    const response = await client.placeOrder({
      category: 'linear',
      symbol,
      side,
      orderType: 'Market',
      qty,
      timeInForce: 'GoodTillCancel',
      takeProfit: tp,
      stopLoss: sl,
    });
    res.json(response);
  } catch (err) {
    console.error('Trade Execution Error:', err);
    res.status(500).json({ error: 'Trade execution failed' });
  }
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`✅ Croak Gateway running on PORT ${PORT}`);
});
