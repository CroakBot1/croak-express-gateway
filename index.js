const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { RestClientV5 } = require('bybit-api');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false, // Set to true if you're using testnet keys
});

app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway Live');
});

app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    res.json(result.result.list[0]);
  } catch (err) {
    console.error('❌ Error fetching balance:', err.message);
    res.status(500).json({ error: 'Failed to fetch balance', details: err.message });
  }
});

app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositionInfo({ category: 'linear' });
    res.json(result.result.list);
  } catch (err) {
    console.error('❌ Error fetching positions:', err.message);
    res.status(500).json({ error: 'Failed to fetch positions', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
