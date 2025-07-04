const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// === TEST ROUTES ===
app.post('/fetch-balance', async (req, res) => {
  // Temporary dummy balance response
  res.json({
    balance: 420.69,
    currency: "USDT"
  });
});

app.post('/fetch-positions', async (req, res) => {
  // Temporary dummy position response
  res.json({
    positions: [
      {
        symbol: "ETHUSDT",
        size: 0.5,
        entryPrice: 3050,
        pnl: 12.5
      }
    ]
  });
});

app.get('/', (req, res) => {
  res.send('🟢 Croak Express Gateway Running');
});

app.listen(PORT, () => {
  console.log(`✅ Croak Gateway running on PORT ${PORT}`);
});
