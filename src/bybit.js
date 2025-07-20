// src/bybit.js

const memory = {
  capital: 1000,
  entry: undefined,
  currentPrice: undefined,
  qty: undefined,
  side: undefined,
};

function getLivePrice(symbol = 'ETHUSDT') {
  console.log(`[📈 MOCK LIVE PRICE] Symbol: ${symbol}`);
  return 2850;
}

function getCandles(symbol = 'ETHUSDT', interval = '1m', limit = 100) {
  console.log(`[📊 MOCK CANDLES] Symbol: ${symbol}, Interval: ${interval}, Limit: ${limit}`);
  return [];
}

function getCapital() {
  console.log(`[💰 MOCK CAPITAL] Returning default 1000 USDT`);
  return 1000;
}

function getPNL() {
  console.log(`[📉 MOCK PNL] Entry: ${memory.entry}, Current: ${memory.currentPrice}, Qty: ${memory.qty}, Side: ${memory.side}`);
  return {
    entryPrice: memory.entry || 0,
    currentPrice: memory.currentPrice || 0,
    qty: memory.qty || 0,
    side: memory.side || 'NONE',
    pnl: 0,
  };
}

function getMemoryState() {
  console.log(`[🧠 MOCK MEMORY] Returning default brain memory state`);
  return {
    strategyVersion: '61K Quantum v5',
    lastTradeTime: Date.now(),
    lastSignal: 'BUY',
    memoryScore: 92.7,
    confidence: 'High',
  };
}

function resetMemoryState() {
  console.log(`[🧹 MOCK RESET] Memory state reset`);
  return true;
}

function placeOrder(side = 'Buy', quantity = 1, symbol = 'ETHUSDT') {
  console.log(`[🛒 MOCK ORDER] Placing ${side} order for ${quantity} ${symbol}`);
  return { success: true, mock: true };
}

module.exports = {
  getLivePrice,
  getCandles,
  getCapital,
  getPNL,
  getMemoryState,
  resetMemoryState,
  placeOrder,
};
