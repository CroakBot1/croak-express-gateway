const express = require('express');
const cors = require('cors');
const Bybit = require('bybit-api');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Bybit({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  testnet: true,
});

app.get('/balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

app.listen(10000, () => {
  console.log('✅ Server running on port 10000');
});
