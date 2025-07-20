const axios = require('axios');

async function fetchPrice() {
  const res = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
  return parseFloat(res.data.result[0].last_price);
}

module.exports = { fetchPrice };
