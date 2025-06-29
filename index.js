const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('🐸 Croak Express Gateway is live!');
});

app.get('/price', async (req, res) => {
  try {
    const response = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price from Bybit' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
