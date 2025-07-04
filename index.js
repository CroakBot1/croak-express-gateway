// == Croak Express Gateway ==
const express = require('express');
const cors = require('cors');
const { RESTClient } = require('bybit-api'); // Make sure this matches installed version

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual credentials (or use Render environment variables)
const client = new RESTClient({
  key: process.env.BYBIT_API_KEY || 'your-api-key',
  secret: process.env.BYBIT_API_SECRET || 'your-secret',
  testnet: true,
});

app.get('/', (req, res) => {
  res.send('Croak Gateway Alive 🐸');
});

// === Trade Execution Route ===
app.post('/execute-trade', async (req, res) => {
  const { category, symbol, side, orderType, qty } = req.body;

  try {
    const response = await client.submitOrder({
      category: category || 'linear',
      symbol,
      side, // 'Buy' or 'Sell'
      orderType: orderType || 'Market',
      qty,
    });

    res.json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// === Server Listener ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Croak Express Gateway running on port ${PORT}`);
});
