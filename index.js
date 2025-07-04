const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v5 } = require('bybit-api');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const client = new v5.RestClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false,
});

// ======= ROUTES =======

// ✅ BALANCE
app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    res.json(result);
  } catch (err) {
    console.error('❌ Error fetching balance:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// ✅ POSITIONS
app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositionInfo({ category: 'linear' });
    res.json(result);
  } catch (err) {
    console.error('❌ Error fetching positions:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway is running!');
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
