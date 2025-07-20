// src/bybit.js

// 🧠 Memory State (Enhanced)
const memoryState = {
  capital: 1000,
  position: null,
  mode: "mock",
  strategyVersion: '61K Quantum v5',
  lastTradeTime: Date.now(),
  lastSignal: 'BUY',
  memoryScore: 92.7,
  confidence: 'High',
};

// ✅ Final export with all functions
module.exports = {
  // 🔹 Mock for fetching live price
  getLivePrice: async (symbol = 'ETHUSDT') => {
    console.log(`[📈 MOCK LIVE PRICE] Symbol: ${symbol}`);
    return 2850;
  },

  // 🔹 Mock for fetching candles
  getCandles: async (symbol = 'ETHUSDT', interval = '1m', limit = 100) => {
    console.log(`[📊 MOCK CANDLES] Symbol: ${symbol}, Interval: ${interval}, Limit: ${limit}`);
    return [];
  },

  // 🔹 Mock for fetching account capital
  getCapital: async () => {
    console.log(`[💰 MOCK CAPITAL] Returning default 1000 USDT`);
    return memoryState.capital;
  },

  // 🔹 Mock for calculating PNL
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

  // 🔹 Merged getMemoryState version
  getMemoryState: () => {
    console.log(`[🧠 MOCK MEMORY] Returning enhanced memory state`);
    return memoryState;
  },

  // 🔹 Mock for placing order
  placeOrder: async (side = 'Buy', quantity = 1, symbol = 'ETHUSDT') => {
    console.log(`[🛒 MOCK ORDER] Placing ${side} order for ${quantity} ${symbol}`);
    return { success: true, mock: true };
  },

  // 🔹 Reset mock memory
  resetMemoryState: () => {
    console.log(`[🧹 MOCK RESET] Memory state reset`);
    memoryState.lastTradeTime = Date.now();
    memoryState.lastSignal = 'NONE';
    memoryState.memoryScore = 100;
    memoryState.confidence = 'Neutral';
    memoryState.position = null;
    return true;
  }
};
