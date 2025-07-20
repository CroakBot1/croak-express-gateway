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
  }
};
