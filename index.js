require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RESTClient } = require('bybit-api');

const app = express();
app.use(cors());
app.use(express.json());

const client = new RESTClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false
});

app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance('UNIFIED');
    res.json(result);
  } catch (err) {
    console.error('❌ Error fetching balance:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await client.getPositionInfo();
    res.json(result);
  } catch (err) {
    console.error('❌ Error fetching positions:', err);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

app.listen(10000, () => {
  console.log('✅ Server running on port 10000');
});
