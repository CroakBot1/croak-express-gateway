const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { RESTClient } = require('bybit-api');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create Bybit Client (TESTNET)
const client = new RESTClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true,
});

// ✅ Default Home Route
app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway LIVE!');
});

// ✅ Fetch USDT Wallet Balance
app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    const usdt = result.result.list[0].coin.find(c => c.coin === 'USDT')?.availableToWithdraw || 0;
    res.json({ usdt });
  } catch (err) {
    console.error('❌ Error fetching balance:', err?.message || err);
    res.status(500).json({ error: 'Balance fetch failed' });
  }
});

// ✅ Fetch Open Positions
app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositions({ category: 'linear' });
    res.json({ positions: result.result.list || [] });
  } catch (err) {
    console.error('❌ Error fetching positions:', err?.message || err);
    res.status(500).json({ error: 'Positions fetch failed' });
  }
});

// ✅ Server Start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
