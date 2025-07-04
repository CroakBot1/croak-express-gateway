const express = require('express');
const cors = require('cors');
const { RESTClientV5 } = require('bybit-api'); // ✅ Correct usage for v5
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ✅ Initialize Bybit REST Client (v5)
const client = RESTClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true, // or false if production
});

// ✅ Example endpoint to test Bybit account balance
app.get('/balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Default root endpoint
app.get('/', (req, res) => {
  res.send('🟢 Croak Express Gateway is LIVE!');
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
