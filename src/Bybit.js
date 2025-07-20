// src/bybit.js

// Mock functions
async function getLivePrice(symbol = 'ETHUSDT') {
  console.log(`[📈 MOCK LIVE PRICE] Symbol: ${symbol}`);
  return 2850; // mock price
}

async function getCandles(symbol = 'ETHUSDT', interval = '1m', limit = 100) {
  console.log(`[📊 MOCK CANDLES] Symbol: ${symbol}, Interval: ${interval}, Limit: ${limit}`);
  return []; // mock candles
}

async function getCapital() {
  console.log(`[💰 MOCK CAPITAL] Returning default 1000 USDT`);
  return 1000;
}

async function getPNL() {
  console.log(`[📉 MOCK PNL] Entry: undefined, Current: undefined, Qty: undefined, Side: undefined`);
  return {
    entryPrice: 0,
    currentPrice: 0,
    qty: 0,
    side: 'NONE',
    pnl: 0,
  };
}

function getMemoryState() {
  console.log(`[🧠 MOCK MEMORY] Returning default brain memory state`);
  return {
    strategyVersion: '61K Quantum v5',
    score: 100,
    lastAction: 'NONE',
    history: [],
    lastTradeTime: Date.now(),
    lastSignal: 'BUY',
    memoryScore: 92.7,
    confidence: 'High',
  };
}

async function placeOrder(side = 'Buy', quantity = 1, symbol = 'ETHUSDT') {
  console.log(`[🛒 MOCK ORDER] Placing ${side} order for ${quantity} ${symbol}`);
  return { success: true, mock: true };
}

function resetMemoryState() {
  console.log(`[🧹 MOCK RESET] Memory state reset`);
  return true;
}

// Export all functions in one block
module.exports = {
  getLivePrice,
  getCandles,
  getCapital,
  getPNL,
  getMemoryState,
  placeOrder,
  resetMemoryState,
};
