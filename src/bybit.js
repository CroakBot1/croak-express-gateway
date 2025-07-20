// src/bybit.js

require('dotenv').config();
const { WebsocketClient, RestClientV5 } = require('bybit-api');

// ✅ Load credentials from .env
const BYBIT_API_KEY = process.env.BYBIT_API_KEY;
const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET;

if (!BYBIT_API_KEY || !BYBIT_API_SECRET) {
  throw new Error("❌ BYBIT_API_KEY & BYBIT_API_SECRET are both required in your environment.");
}

// ✅ REST client for placing orders, getting balance, etc.
const rest = new RestClientV5({
  key: BYBIT_API_KEY,
  secret: BYBIT_API_SECRET,
  testnet: false, // Set to true if you're using testnet
});

// ✅ WebSocket client (optional real-time updates)
const ws = new WebsocketClient({
  key: BYBIT_API_KEY,
  secret: BYBIT_API_SECRET,
  market: 'v5',
  testnet: false,
});

// ✅ PLACE ORDER
async function placeOrder({ symbol, side, qty, price, orderType = 'Market' }) {
  try {
    const res = await rest.submitOrder({
      category: 'linear',
      symbol,
      side,
      orderType,
      qty,
      price,
      timeInForce: 'GoodTillCancel',
    });
    console.log('✅ Order Response:', res);
    return res;
  } catch (err) {
    console.error('❌ Failed to place order:', err.message || err);
    return null;
  }
}

// ✅ GET POSITION
async function getPositions(symbol = 'ETHUSDT') {
  try {
    const res = await rest.getPositionInfo({ category: 'linear', symbol });
    return res;
  } catch (err) {
    console.error('❌ Failed to get positions:', err.message || err);
    return null;
  }
}

// ✅ GET WALLET BALANCE
async function getBalance() {
  try {
    const res = await rest.getWalletBalance({ accountType: 'UNIFIED' });
    return res;
  } catch (err) {
    console.error('❌ Failed to fetch wallet balance:', err.message || err);
    return null;
  }
}

// ✅ TRAILING STOP (Auto-sell logic)
async function setTrailingStop({ symbol, trailingStop, positionIdx = 0 }) {
  try {
    const res = await rest.setTradingStop({
      category: 'linear',
      symbol,
      trailingStop,
      positionIdx,
    });
    return res;
  } catch (err) {
    console.error('❌ Failed to set trailing stop:', err.message || err);
    return null;
  }
}

// ✅ EXPORT
module.exports = {
  rest,
  ws,
  placeOrder,
  getPositions,
  getBalance,
  setTrailingStop,
};
