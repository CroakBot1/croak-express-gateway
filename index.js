require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RestClient } = require('@bybit-api/sdk'); // ✅ CORRECT SDK
const app = express();
app.use(cors());
app.use(express.json());

const client = new RestClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false
});

app.post('/fetch-balance', async (req, res) => {
  try {
    const response = await client.getWalletBalance({ accountType: 'UNIFIED' });
    res.json(response);
  } catch (error) {
    console.error('❌ Balance error:', error?.message || error);
    res.status(500).json({ error: 'Balance fetch failed' });
  }
});

app.post('/fetch-positions', async (req, res) => {
  try {
    const response = await client.getPositions({ category: 'linear' });
    res.json(response);
  } catch (error) {
    console.error('❌ Position error:', error?.message || error);
    res.status(500).json({ error: 'Position fetch failed' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
