const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { RestClientV5 } = require('bybit-api');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ TEMP: Hardcoded keys for testing (secure this later with .env)
const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY || 'g0aRVC0kDOFBEQtn3j',
  secret: process.env.BYBIT_API_SECRET || '8785p6XHLQcjPGKtDHuUiNoWqNnc4AFKtANz',
  testnet: true,
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway LIVE!');
});

// ✅ Balance route
app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });

    const usdt = result?.result?.list?.[0]?.coin?.find(c => c.coin === 'USDT')?.availableToWithdraw ?? 0;
    console.log('🪙 USDT Balance:', usdt);

    res.json({ usdt });
  } catch (err) {
    console.error('❌ Error fetching balance:', err?.message || err);
    res.status(500).json({ error: 'Balance fetch failed', details: err?.message || err });
  }
});

// ✅ Positions route
app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositions({ category: 'linear' });

    const positions = result?.result?.list || [];
    console.log('📊 Open Positions:', positions.length);

    res.json({ positions });
  } catch (err) {
    console.error('❌ Error fetching positions:', err?.message || err);
    res.status(500).json({ error: 'Positions fetch failed', details: err?.message || err });
  }
});

// ✅ Port binding
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
