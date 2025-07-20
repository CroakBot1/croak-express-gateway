// src/bybit.js

module.exports = {
  // Mock for fetching live price
  getLivePrice: async (symbol = 'ETHUSDT') => {
    console.log(`[📈 MOCK LIVE PRICE] Symbol: ${symbol}`);
    return 2850; // mock price
  },

  // Mock for fetching candles
  getCandles: async (symbol = 'ETHUSDT', interval = '1m', limit = 100) => {
    console.log(`[📊 MOCK CANDLES] Symbol: ${symbol}, Interval: ${interval}, Limit: ${limit}`);
    return []; // mock candles
  },

  // Mock for fetching account capital
  getCapital: async () => {
    console.log(`[💰 MOCK CAPITAL] Returning default 1000 USDT`);
    return 1000;
  },

  // Mock for calculating PNL
  getPNL: async () => {
    console.log(`[📉 MOCK PNL] Entry: undefined, Current: undefined, Qty: undefined, Side: undefined`);
    return {
      entryPrice: 0,
      currentPrice: 0,
      qty: 0,
      side: 'NONE',
      pnl: 0,
    };
  },

  // Memory State for strategy (mocked)
  getMemoryState: () => {
    console.log(`[🧠 MOCK MEMORY] Returning default brain memory state`);
    return {
      score: 100,
      lastAction: 'NONE',
      history: [],
    };
  },

  // Fallback mock for placing order
  placeOrder: async (side = 'Buy', quantity = 1, symbol = 'ETHUSDT') => {
    console.log(`[🛒 MOCK ORDER] Placing ${side} order for ${quantity} ${symbol}`);
    return { success: true, mock: true };
  },

  // Optional: clear mock memory
  resetMemoryState: () => {
    console.log(`[🧹 MOCK RESET] Memory state reset`);
    return true;
  },
};
