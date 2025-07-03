const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { LinearClient } = require('bybit-api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// === Bybit Client ===
const client = new LinearClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true,
});

// === Email Transport ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,         // e.g. apploverss3@gmail.com
    pass: process.env.EMAIL_PASS,         // Gmail app password
  },
});

// === Route: Test ping ===
app.get('/', (req, res) => {
  res.send('CROAK BOT BACKEND is LIVE 🐸🚀');
});

// === Route: Execute Trade ===
app.post('/execute-trade', async (req, res) => {
  const { side, qty } = req.body;

  if (!['Buy', 'Sell'].includes(side)) {
    return res.status(400).json({ error: 'Invalid trade side' });
  }

  try {
    const order = await client.placeActiveOrder({
      symbol: 'ETHUSDT',
      side,
      order_type: 'Market',
      qty: qty || 0.01,
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false,
    });

    // === Send Email Notification ===
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🚀 CROAK BOT Executed ${side} Trade`,
      text: `Trade executed:\nSide: ${side}\nQty: ${qty || 0.01}\nSymbol: ETHUSDT\nStatus: SUCCESS`,
    });

    res.json({ success: true, result: order });
  } catch (error) {
    console.error('❌ Trade failed:', error);
    res.status(500).json({ error: 'Trade failed', details: error.toString() });
  }
});

// === Start Server ===
app.listen(port, () => {
  console.log(`✅ CROAK BOT BACKEND running on http://localhost:${port}`);
});
