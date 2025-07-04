const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());            // Enable CORS for all origins
app.use(express.json());    // Parse JSON body requests

// Dummy data (simulate user balance and positions)
let dummyBalance = { usdt: 1000 };
let dummyPositions = [
  { symbol: 'ETHUSDT', size: 1, entryPrice: 1900, side: 'Buy' }
];

// GET /fetch-balance
app.get('/fetch-balance', (req, res) => {
  res.json(dummyBalance);
});

// GET /fetch-positions
app.get('/fetch-positions', (req, res) => {
  res.json(dummyPositions);
});

// POST /place-order
app.post('/place-order', (req, res) => {
  const { side, qty, tp, sl } = req.body;

  if (!side || !qty) {
    return res.status(400).json({ success: false, message: 'Missing required fields: side or qty' });
  }

  // Simulate adding position
  dummyPositions.push({
    symbol: 'ETHUSDT',
    size: qty,
    side: side.toUpperCase(),
    entryPrice: 1900,  // just dummy price
    tp,
    sl
  });

  // Simulate balance deduction (naive)
  dummyBalance.usdt -= qty * 1900;

  console.log(`[ORDER] side=${side}, qty=${qty}, tp=${tp}, sl=${sl}`);

  res.json({ success: true, message: 'Order placed successfully' });
});

// 404 handler for other routes — return JSON instead of HTML
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Internal server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Croak Bot Backend running on port ${PORT}`);
});
