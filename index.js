require('dotenv').config();
const express = require('express');
const { RESTClientV5 } = require('bybit-api');

const app = express();
app.use(express.json());

const client = new RESTClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true,
});

app.get('/', (req, res) => {
  res.send('CROAK EXPRESS GATEWAY RUNNING');
});

app.get('/balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance('UNIFIED');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Croak Express running on port ${PORT}`);
});
