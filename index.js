const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Croak Gateway is LIVE');
});

// === FETCH BALANCE ===
app.post('/fetch-balance', async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;

    // Dummy data for testing frontend
    const fakeBalance = {
      USDT: 1234.56,
      BTC: 0.005,
      ETH: 0.25
    };

    res.json(fakeBalance);
  } catch (err) {
    console.error('Fetch Balance Error:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// === FETCH POSITIONS ===
app.post('/fetch-positions', async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;

    // Dummy data for open trades testing
    const positions = [
      {
        symbol: 'ETHUSDT',
        side: 'Buy',
        size: 0.5,
        entryPrice: 3100.00,
        unrealizedPnl: 45.00,
        leverage: 10
      },
      {
        symbol: 'BTCUSDT',
        side: 'Sell',
        size: 0.01,
        entryPrice: 65000.00,
        unrealizedPnl: -20.00,
        leverage: 5
      }
    ];

    res.json(positions);
  } catch (err) {
    console.error('Fetch Positions Error:', err);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// === START SERVER ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Croak Gateway running on PORT ${PORT}`);
});
