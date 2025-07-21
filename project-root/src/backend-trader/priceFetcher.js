const axios = require('axios');

async function getBybitPrice(symbol = "ETHUSDT") {
  const url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`;
  try {
    const res = await axios.get(url);
    const price = parseFloat(res.data.result.list[0].lastPrice);
    return price;
  } catch (err) {
    console.error("❌ Failed to fetch price from Bybit:", err.message);
    return null;
  }
}

module.exports = { getBybitPrice };

