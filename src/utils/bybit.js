// src/utils/bybit.js

const { USDCClient, USDTPair, linear, inverse } = require('bybit-api'); // Optional backup
const { LinearClient } = require('bybit-api');
const logger = require('../logger');

const client = new LinearClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false, // ⚠️ Set to false for LIVE
});

async function placeMarketOrder(symbol, side, qty) {
  try {
    const response = await client.placeActiveOrder({
      symbol: symbol,
      side: side, // "Buy" or "Sell"
      order_type: "Market",
      qty: qty,
      time_in_force: "GoodTillCancel",
      reduce_only: false,
      close_on_trigger: false,
    });

    logger.info(`[LIVE ORDER] ${side} ${qty} ${symbol}:`, response);
    return response;
  } catch (err) {
    logger.error("[❌ LIVE ORDER ERROR]", err.message || err);
    return null;
  }
}

async function getWalletBalance(coin = "USDT") {
  try {
    const res = await client.getWalletBalance({ coin });
    const balance = res.result[coin]?.available_balance;
    logger.info(`[BALANCE] ${coin}: ${balance}`);
    return balance;
  } catch (err) {
    logger.error("[❌ GET BALANCE ERROR]", err.message || err);
    return 0;
  }
}

async function getOpenPositions(symbol = "ETHUSDT") {
  try {
    const res = await client.getPositionList({ symbol });
    return res.result;
  } catch (err) {
    logger.error("[❌ POSITION ERROR]", err.message || err);
    return [];
  }
}

module.exports = {
  placeMarketOrder,
  getWalletBalance,
  getOpenPositions,
};
