// src/utils/bybit.js

module.exports = {
  buy: async (symbol, qty) => {
    console.log(`[🟢 MOCK BUY] Symbol: ${symbol}, Qty: ${qty}`);
    return { success: true };
  },

  sell: async (symbol, qty) => {
    console.log(`[🔴 MOCK SELL] Symbol: ${symbol}, Qty: ${qty}`);
    return { success: true };
  },

  getBalance: async () => {
    console.log(`[💰 MOCK BALANCE] Returning fake balance`);
    return { balance: 9999 };
  },

  getCandles: async (symbol, interval, limit = 100) => {
    console.log(`[📊 MOCK CANDLES] Symbol: ${symbol}, Interval: ${interval}, Limit: ${limit}`);
    
    // Dummy candles: OHLCV pattern (open, high, low, close, volume)
    const candles = Array.from({ length: limit }, (_, i) => ({
      open: 2800 + i,
      high: 2850 + i,
      low: 2750 + i,
      close: 2820 + i,
      volume: 1000 + i
    }));

    return candles;
  }
};
