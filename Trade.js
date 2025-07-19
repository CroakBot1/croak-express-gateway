// trade.js
require('dotenv').config();
const { RestClientV5 } = require('bybit-api');

const client = new RestClientV5({
  key: process.env.BYBIT_KEY,
  secret: process.env.BYBIT_SECRET,
  testnet: false, // set to true kung testnet imong gamit
});

/**
 * Executes a market order on Bybit Futures (Linear).
 * @param {'Buy'|'Sell'} side - Direction of the order.
 * @param {string} symbol - Trading pair, e.g., 'ETHUSDT'.
 * @param {number} qty - Quantity to buy or sell.
 */
async function executeTrade(side = 'Buy', symbol = 'ETHUSDT', qty = 0.01) {
  try {
    const response = await client.submitOrder({
      category: 'linear',
      symbol,
      side,
      orderType: 'Market',
      qty,
      timeInForce: 'GoodTillCancel',
    });

    console.log(`[✅ EXECUTED] ${side} ${qty} ${symbol}`);
    return response;
  } catch (error) {
    console.error('[❌ TRADE ERROR]', error?.message || error);
    return null;
  }
}

module.exports = { executeTrade };
