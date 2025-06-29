const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/price', async (req, res) => {
  try {
    const response = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
    const price = response.data.result[0].last_price;
    res.json({ symbol: 'ETHUSDT', price });
  } catch (error) {
    console.error('Error fetching ETH price:', error.message);
    res.status(500).json({ error: 'Failed to fetch ETH price' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
