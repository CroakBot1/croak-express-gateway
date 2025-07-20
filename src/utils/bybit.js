const axios = require('axios');

// 🕯️ Fetch historical candles (default 1m)
async function getCandles(symbol = 'ETHUSDT', interval = '1', limit = 50) {
  try {
    const response = await axios.get('https://api.bybit.com/v5/market/kline', {
      params: {
        category: 'linear',
        symbol,
        interval,
        limit
      }
    });

    const candles = response.data.result.list.map(candle => ({
      timestamp: parseInt(candle[0]),
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    })).reverse(); // oldest to newest

    return candles;
  } catch (error) {
    console.error('[❌ getCandles ERROR]', error.message);
    return [];
  }
}

// 💸 Fetch live price (last traded price)
async function getLivePrice(symbol = 'ETHUSDT') {
  try {
    const response = await axios.get('https://api.bybit.com/v2/public/tickers', {
      params: { symbol }
    });

    const price = parseFloat(response.data.result[0].last_price);
    return price;
  } catch (error) {
    console.error('[❌ getLivePrice ERROR]', error.message);
    return null;
  }
}

module.exports = {
  getCandles,
  getLivePrice
};
