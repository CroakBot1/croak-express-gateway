const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// === ROUTES ===
app.get('/fetch-balance', (req, res) => {
  res.json({ balance: 69420.00, asset: 'USDT' });
});

app.get('/fetch-positions', (req, res) => {
  res.json([
    { symbol: 'ETHUSDT', side: 'long', size: 1.5, entry: 3000 },
    { symbol: 'BTCUSDT', side: 'short', size: 0.8, entry: 60000 },
  ]);
});

app.post('/execute-trade', (req, res) => {
  const { symbol, side, size, price } = req.body;
  console.log(`[TRADE] ${side} ${size} ${symbol} @ ${price}`);
  res.json({ success: true, message: `Trade executed: ${side} ${size} ${symbol} @ ${price}` });
});

app.get('/', (req, res) => {
  res.send('✅ Croak Bot Backend is Live!');
});

app.listen(PORT, () => {
  console.log(`✅ Croak Bot Backend running on port ${PORT}`);
});
