// src/bybit.js

export function getPrice(symbol = 'ETHUSDT') {
  console.log(`[📊 MOCK PRICE] Returning mock price for ${symbol}`);
  return 2850.00; // mock price
}

export function placeOrder({ side, qty, price, symbol = 'ETHUSDT' }) {
  console.log(`[🟢 MOCK ORDER] ${side} ${qty} ${symbol} at ${price}`);
  return {
    status: 'filled',
    orderId: Date.now(),
    side,
    qty,
    price,
    symbol,
  };
}

export function getPosition(symbol = 'ETHUSDT') {
  console.log(`[📌 MOCK POSITION] Returning mock position`);
  return {
    entryPrice: 2800,
    currentPrice: 2850,
    qty: 0.5,
    side: 'Long',
    pnl: 25,
    pnlPct: 1.75,
  };
}

export function getBalance(asset = 'USDT') {
  console.log(`[💰 MOCK BALANCE] Returning mock balance`);
  return {
    asset,
    walletBalance: 1000,
    availableBalance: 950,
  };
}

export function getMemoryState() {
  console.log(`[🧠 MOCK MEMORY STATE] Returning default memory state`);
  return {
    strategyVersion: '61K Quantum v5',
    lastTradeTime: Date.now(),
    lastSignal: 'BUY',
    memoryScore: 92.7,
    confidence: 'High',
    changePct: 1.23, // ✅ FIXED: this was missing
    volatilityScore: 0.77,
    trend: 'BULLISH',
  };
}

export function getMockPNL() {
  const position = getPosition();
  console.log(`[📉 MOCK PNL] Entry: ${position.entryPrice}, Current: ${position.currentPrice}, Qty: ${position.qty}, Side: ${position.side}`);
  return {
    entry: position.entryPrice,
    current: position.currentPrice,
    qty: position.qty,
    side: position.side,
    pnl: position.pnl,
    pnlPct: position.pnlPct,
  };
}

export function getMockCapital() {
  console.log(`[💰 MOCK CAPITAL] Returning default 1000 USDT`);
  return 1000;
}
