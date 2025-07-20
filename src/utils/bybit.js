const { LinearClient } = require('bybit-api');

// This will hold the initialized client
let client = null;

/**
 * Initializes the Bybit client with API key & secret from environment.
 * Must be called before using other functions.
 */
function initBybitClient() {
  const { BYBIT_API_KEY, BYBIT_API_SECRET } = process.env;

  if (!BYBIT_API_KEY || !BYBIT_API_SECRET) {
    throw new Error('❌ BYBIT_API_KEY & BYBIT_API_SECRET are required in .env file.');
  }

  client = new LinearClient({
    key: BYBIT_API_KEY,
    secret: BYBIT_API_SECRET,
    testnet: false, // change to true if using testnet
  });

  console.log('✅ Bybit client initialized successfully.');
}

/**
 * Example function: Get current price of a symbol
 */
async function getLivePrice(symbol = 'ETHUSDT') {
  if (!client) throw new Error('❌ Bybit client not initialized.');
  const res = await client.getTickers({ category: 'linear', symbol });
  return res.result.list[0];
}

/**
 * Example function: Place a market order (buy or sell)
 */
async function executeMarketOrder({ symbol = 'ETHUSDT', side = 'Buy', qty = 0.01 }) {
  if (!client) throw new Error('❌ Bybit client not initialized.');

  const res = await client.placeOrder({
    category: 'linear',
    symbol,
    side,
    orderType: 'Market',
    qty,
    timeInForce: 'GoodTillCancel',
  });

  return res;
}

module.exports = {
  initBybitClient,
  getLivePrice,
  executeMarketOrder,
};
