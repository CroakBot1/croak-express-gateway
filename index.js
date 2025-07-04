const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { WebSocketClient, RestClientV5 } = require('bybit-api');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// === BYBIT V5 CLIENT ===
const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false,
});

// === TEST ENDPOINT ===
app.get('/', (req, res) => {
  res.send('🟢 Croak Gateway is Alive!');
});

// === SAMPLE TRADE DATA FETCH ===
app.get('/price', async (req, res) => {
  try {
    const { result } = await client.getKline({
      category: 'linear',
      symbol: 'ETHUSDT',
      interval: '1',
      limit: 1,
    });

    const latest = result.list[0];
    res.json({
      timestamp: latest[0],
      open: latest[1],
      high: latest[2],
      low: latest[3],
      close: latest[4],
    });
  } catch (err) {
    console.error('❌ Error fetching kline:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Croak Gateway running on PORT ${PORT}`);
});
