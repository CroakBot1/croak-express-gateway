// == CROAK EXPRESS GATEWAY BACKEND ==
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { RESTClient } = require('bybit-api'); // ✅ Correct class name

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create Bybit REST Client
const client = new RESTClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true, // Set to false if you're using mainnet
});

// ✅ Home route
app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway LIVE!');
});

// ✅ Fetch wallet balance (USDT)
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

// ✅ Fetch open positions
app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositions({ category: 'linear' });
    res.json({ positions: result.result.list || [] });
  } catch (err) {
    console.error('❌ Error fetching positions:', err?.message || err);
    res.status(500).json({ error: 'Positions fetch failed' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
