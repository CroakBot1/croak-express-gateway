const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { RESTClient } = require('bybit-api'); // Use correct import

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize Bybit Client (TESTNET for now)
const client = new RESTClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true
});

// ✅ Health Check
app.get('/', (req, res) => res.send('✅ Croak API Live'));

// ✅ Fetch Balance
app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    console.log('💰 Wallet Balance:', result);

    const usdt = result.result.list[0].coin.find(c => c.coin === 'USDT')?.availableToWithdraw || 0;
    res.json({ usdt });
  } catch (err) {
    console.error('❌ Error fetching balance:', err);
    res.status(500).json({ error: 'Failed to fetch balance', details: err.message });
  }
});

// ✅ Fetch Open Positions
app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositionInfo({ category: 'linear' }); // You can change to 'inverse' or 'option'
    console.log('📊 Position Info:', result);
    res.json(result);
  } catch (err) {
    console.error('❌ Error fetching positions:', err);
    res.status(500).json({ error: 'Failed to fetch positions', details: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
