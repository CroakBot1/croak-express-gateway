const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Croak Express Gateway is alive! 🐸');
});

app.get('/price', async (req, res) => {
  try {
    const resp = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
    res.json(resp.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch price from Bybit' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});
