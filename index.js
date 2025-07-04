require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RESTClient } = require('bybit-api');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const client = new RESTClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true
});

// === ORIGINAL CYCLE: Log trade only ===
app.post('/execute-trade', (req, res) => {
  const { side, qty } = req.body;
  console.log(`Received trade: ${side} ${qty}`);
  res.json({ status: 'success', side, qty });
});

// === FRONTEND REQUIRED: Place actual trade ===
app.post('/place-order', async (req, res) => {
  try {
    const { side, qty, tp, sl } = req.body;
    const result = await client.placeActiveOrder({
      symbol: 'ETHUSDT',
      side,
      order_type: 'Market',
      qty,
      take_profit: tp,
      stop_loss: sl,
      time_in_force: 'GoodTillCancel'
    });
    console.log('✅ Order Placed:', result);
    res.json({ success: true, result });
  } catch (err) {
    console.error('❌ Order Failed:', err.message);
    res.json({ success: false, message: err.message });
  }
});

// === FRONTEND REQUIRED: Fetch wallet balance ===
app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    const usdt = result.result.list[0].coin.find(c => c.coin === 'USDT')?.availableToWithdraw || 0;
    res.json({ usdt });
  } catch (err) {
    console.error('❌ Balance Fetch Error:', err.message);
    res.json({ usdt: 0 });
  }
});

// === FRONTEND REQUIRED: Fetch open positions ===
app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositionInfo({
      category: 'linear',
      symbol: 'ETHUSDT'
    });
    res.json(result.result.list || []);
  } catch (err) {
    console.error('❌ Position Fetch Error:', err.message);
    res.json([]);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
