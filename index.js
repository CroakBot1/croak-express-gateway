// == index.js (Backend for Croak Bot V32 - Full FIX with Live Execution Support) ==

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy LICENSE KEY database
const VALID_KEYS = ['32239105688', '29672507957', '12550915154'];

// Dummy credentials (replace with real Bybit API handling)
const FAKE_BALANCE = 1000;
const FAKE_POSITIONS = [{ symbol: 'ETHUSDT', side: 'Buy', size: 0.05 }];

// === ROUTES === //

app.post('/place-order', (req, res) => {
  const { symbol, side, qty, price, orderType, timeInForce, license } = req.body;

  if (!symbol || !side || !qty || license == null) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  if (!VALID_KEYS.includes(license)) {
    return res.status(403).json({ success: false, message: 'Invalid license key' });
  }

  // Simulate execution (replace this with real API logic for Bybit)
  const orderId = uuidv4();
  return res.json({
    success: true,
    message: 'Order placed successfully',
    orderId,
    symbol,
    side,
    qty,
    price,
    orderType: orderType || 'Market',
    timeInForce: timeInForce || 'IOC'
  });
});

app.get('/fetch-balance', (req, res) => {
  return res.json({ usdt: FAKE_BALANCE });
});

app.get('/fetch-positions', (req, res) => {
  return res.json(FAKE_POSITIONS);
});

// Start server
app.listen(port, () => {
  console.log(`🟢 Croak Express Gateway running on port ${port}`);
});
