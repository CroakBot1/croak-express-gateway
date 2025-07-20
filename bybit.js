// src/utils/bybit.js

// 🕯️ Mock function to simulate historical candles
function getCandles(symbol) {
  console.log(`[🕯️ MOCK CANDLES] Fetching mock candles for ${symbol}`);
  const now = Date.now();
  return Array.from({ length: 30 }).map((_, i) => ({
    timestamp: now - (30 - i) * 60 * 1000,
    open: 2800 + Math.random() * 100,
    close: 2800 + Math.random() * 100,
    high: 2900 + Math.random() * 100,
    low: 2700 + Math.random() * 100,
    volume: Math.random() * 1000,
  }));
}

// 📈 Simulated real-time price fetch
function getLivePrice(symbol) {
  const price = 2850 + Math.random() * 50;
  console.log(`[📈 MOCK LIVE PRICE] Symbol: ${symbol}, Price: ${price.toFixed(2)}`);
  return price;
}

// 📉 Mock PnL calculator
function getPnL(entryPrice, currentPrice, qty, side) {
  if (!entryPrice || !currentPrice || !qty || !side) {
    console.log(`[📉 MOCK PNL] Entry: ${entryPrice}, Current: ${currentPrice}, Qty: ${qty}, Side: ${side}`);
    return 0;
  }

  const direction = side.toUpperCase() === "LONG" ? 1 : -1;
  const pnl = (currentPrice - entryPrice) * qty * direction;
  console.log(`[📉 MOCK PNL] Entry: ${entryPrice}, Current: ${currentPrice}, Qty: ${qty}, Side: ${side}, PnL: ${pnl}`);
  return pnl;
}

// 💰 Returns mock capital
function getCapital() {
  const capital = 1000;
  console.log(`[💰 MOCK CAPITAL] Returning default ${capital} USDT`);
  return capital;
}

// ✅ Simulate a trade execution
function executeTrade(symbol, side, qty) {
  const price = getLivePrice(symbol);
  const ts = Date.now();
  console.log(`[✅ MOCK TRADE EXECUTED] ${side.toUpperCase()} ${qty} ${symbol} @ ${price} (timestamp: ${ts})`);
  return {
    status: "FILLED",
    symbol,
    side,
    qty,
    price,
    timestamp: ts,
  };
}

// 🧠 Mock memory state
function getMemoryState() {
  console.log(`[🧠 MOCK MEMORY STATE] Returning default memory state`);
  return {
    lastDecision: null,
    tradeCount: 0,
    lastTradeTimestamp: null,
    memoryScore: 0,
    lastPNL: 0,
  };
}

// ✅ Export all mock functions
module.exports = {
  getCandles,
  getLivePrice,
  getPnL,
  getCapital,
  executeTrade,
  getMemoryState,
};
