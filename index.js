const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { LinearClient } = require('bybit-api');

const app = express();
app.use(cors()); // ✅ Enable CORS for all origins
app.use(express.json({ limit: '5mb' }));

// === Bybit credentials ===
const API_KEY = 'gFfn69kLKBsRzAQpSo';
const API_SECRET = 'MaZLcwY6KaeaAVqiNPB6zLXZOpYwi1UDQdex';

const client = new LinearClient({
  key: API_KEY,
  secret: API_SECRET,
  testnet: false, // set to true if using testnet
});

// === Trade handler ===
app.post('/execute-trade', async (req, res) => {
  const { side, qty } = req.body;

  if (!side || !qty) {
    return res.status(400).json({ error: 'Missing side or quantity' });
  }

  try {
    const order = await client.placeActiveOrder({
      symbol: 'ETHUSDT',
      side: side.toUpperCase(),
      order_type: 'Market',
      qty,
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false,
    });

    console.log('✅ Order placed:', order);
    res.json({ status: 'success', order });
  } catch (err) {
    console.error('❌ Order failed:', err);
    res.status(500).json({ error: 'Order execution failed', details: err });
  }
});

// === Email sender ===
app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your@email.com',
      pass: 'your-app-password'
    }
  });

  try {
    await transporter.sendMail({
      from: '"Croak Bot" <your@email.com>',
      to,
      subject,
      text: message,
    });
    res.json({ status: 'Email sent' });
  } catch (err) {
    console.error('Email failed:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// === Start server ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
