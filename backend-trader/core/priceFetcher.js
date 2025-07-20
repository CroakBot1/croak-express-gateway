// priceFetcher.js
const axios = require('axios');

async function getETHPrice() {
  try {
    const res = await axios.get('https://api.bybit.com/v5/market/tickers?category=linear&symbol=ETHUSDT');
    const price = parseFloat(res.data.result.list[0].lastPrice);
    return price;
  } catch (err) {
    console.error("❌ Error fetching ETH price:", err);
    return null;
  }
}

module.exports = getETHPrice;

