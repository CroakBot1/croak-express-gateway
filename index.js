const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { LinearClient } = require('bybit-api');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ✅ Setup Bybit client for real execution (testnet)
const client = new LinearClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true,
});

// ✅ Send email result to you
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Accept trade instructions from frontend
app.post('/execute-trade', async (req, res) => {
  const { side, qty } = req.body;

  try {
    const order = await client.placeActiveOrder({
      symbol: 'ETHUSDT',
      side: side === 'BUY' ? 'Buy' : 'Sell',
      order_type: 'Market',
      qty: qty,
      time_in_force: 'GoodTillCancel',
    });

    // ✅ Notify you via email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Croak Bot Trade Executed: ${side}`,
      html: `<h3>${side} ${qty} ETHUSDT executed on Bybit Testnet</h3><pre>${JSON.stringify(order.data, null, 2)}</pre>`,
    });

    res.json({ status: 'success', order: order.data });
  } catch (err) {
    console.error('[Trade Error]', err?.message || err);
    res.status(500).json({ status: 'error', message: err?.message || 'Unknown error' });
  }
});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('CROAK BOT BACKEND RUNNING 🐸');
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
