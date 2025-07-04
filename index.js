const express = require('express');
const cors = require('cors');
const { RESTClient } = require('bybit-api'); // ✅ Correct import

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new RESTClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true, // set to false for live
});

// Sample route to test if working
app.get('/', async (req, res) => {
  try {
    const result = await client.getServerTime();
    res.json({ status: 'ok', serverTime: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'API error', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
