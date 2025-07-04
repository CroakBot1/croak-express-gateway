const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { RestClientV5 } = require('bybit-api'); // ✅ correct class

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct client instantiation
const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true
});

app.get('/', (req, res) => res.send('✅ Croak API Live'));

app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await client.getWalletBalance({ accountType: 'UNIFIED' });
    const usdt = result.result.list[0].coin.find(c => c.coin === 'USDT')?.availableToWithdraw || 0;
    res.json({ usdt });
  } catch (err) {
    console.error('Fetch Balance Error:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
