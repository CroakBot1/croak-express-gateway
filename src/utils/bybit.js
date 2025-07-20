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

  getCandles: async (symbol, interval = "1m", limit = 100) => {
    console.log(`[📊 MOCK CANDLES] Symbol: ${symbol}, Interval: ${interval}, Limit: ${limit}`);
    
    const candles = Array.from({ length: limit }, (_, i) => ({
      open: 2800 + i,
      high: 2850 + i,
      low: 2750 + i,
      close: 2820 + i,
      volume: 1000 + i
    }));

    return candles;
  },

  getLivePrice: async (symbol) => {
    console.log(`[📈 MOCK LIVE PRICE] Symbol: ${symbol}`);
    return 2830.25;
  },

  getPnL: async (entryPrice, currentPrice, qty, side) => {
    console.log(`[📉 MOCK PNL] Entry: ${entryPrice}, Current: ${currentPrice}, Qty: ${qty}, Side: ${side}`);

    let pnl = 0;
    if (side === 'LONG') {
      pnl = (currentPrice - entryPrice) * qty;
    } else if (side === 'SHORT') {
      pnl = (entryPrice - currentPrice) * qty;
    }

    return { pnl };
  }
};
