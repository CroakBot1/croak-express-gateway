const axios = require('axios');

// ✅ CANDLE DATA
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
    })).reverse();

    return candles;
  } catch (error) {
    console.error('[❌ getCandles ERROR]', error.message);
    return [];
  }
}

// ✅ FIXED PRICE FETCHER
async function getLivePrice(symbol = 'ETHUSDT') {
  try {
    const response = await axios.get('https://api.bybit.com/v5/market/tickers', {
      params: {
        category: 'linear',
        symbol
      }
    });

    const price = parseFloat(response.data.result.list[0].lastPrice);
    return price;
  } catch (error) {
    console.error('[❌ getLivePrice ERROR]', error.message);
    return null;
  }
}

// ✅ MOCK PnL READER
async function getPnL(symbol = 'ETHUSDT') {
  return {
    unrealizedPnl: 12.34,
    percentage: 3.21
  };
}

module.exports = {
  getCandles,
  getLivePrice,
  getPnL
};
