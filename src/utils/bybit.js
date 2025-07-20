// src/utils/bybit.js
const axios = require('axios');

// ✅ LIVE fetch from Bybit V5 API
async function getCandles(symbol = 'ETHUSDT', interval = '1', limit = 100) {
  try {
    const response = await axios.get('https://api.bybit.com/v5/market/kline', {
      params: {
        category: 'linear',
        symbol,
        interval,
        limit,
      },
    });

    const candles = response.data.result.list.map(candle => ({
      timestamp: parseInt(candle[0]),
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
    }));

    return candles.reverse(); // earliest to latest
  } catch (error) {
    console.error('[❌ getCandles ERROR]', error.message);
    return [];
  }
}

module.exports = {
  getCandles,
};
