// src/utils/bybit.js

const { LinearClient } = require('bybit-api');
const axios = require('axios');
const logger = require('../logger');

const client = new LinearClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false,
});

// -------------------- LIVE ORDER EXECUTION --------------------

async function placeMarketOrder(symbol, side, qty) {
  try {
    const response = await client.placeActiveOrder({
      symbol,
      side, // "Buy" or "Sell"
      order_type: "Market",
      qty,
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

// -------------------- PRICE DATA --------------------

async function getCandles(symbol = "ETHUSDT", interval = "1") {
  try {
    const res = await client.getKline({ symbol, interval, limit: 200 });
    return res.result;
  } catch (err) {
    logger.error("[❌ CANDLES ERROR]", err.message || err);
    return [];
  }
}

async function getLivePrice(symbol = "ETHUSDT") {
  try {
    const res = await axios.get(`https://api.bybit.com/v2/public/tickers?symbol=${symbol}`);
    const price = parseFloat(res.data.result[0].last_price);
    logger.info(`[📈 LIVE PRICE] ${symbol}: ${price}`);
    return price;
  } catch (err) {
    logger.error("[❌ LIVE PRICE ERROR]", err.message || err);
    return 0;
  }
}

// -------------------- WALLET / POSITION --------------------

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

async function getCapital(symbol = "ETHUSDT") {
  return await getWalletBalance("USDT"); // Simplified capital base
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

async function getPnL(symbol = "ETHUSDT") {
  try {
    const positions = await getOpenPositions(symbol);
    if (!positions || !positions.length) return 0;
    const pos = positions[0];
    const pnl = parseFloat(pos.unrealised_pnl || 0);
    logger.info(`[📊 PnL] ${symbol}: ${pnl}`);
    return pnl;
  } catch (err) {
    logger.error("[❌ PnL ERROR]", err.message || err);
    return 0;
  }
}

// -------------------- STATE TRACKING --------------------

let memoryState = {};

function getMemoryState() {
  return memoryState;
}

function setMemoryState(state) {
  memoryState = { ...memoryState, ...state };
  logger.info("[🧠 STATE UPDATED]", memoryState);
}

function resetState() {
  memoryState = {};
  logger.warn("[🔄 STATE RESET]");
}

// -------------------- TRADE EXECUTION WRAPPER --------------------

async function executeTrade(symbol, action, qty) {
  const side = action.toUpperCase() === 'BUY' ? 'Buy' : 'Sell';
  return await placeMarketOrder(symbol, side, qty);
}

// -------------------- EXPORTS --------------------

module.exports = {
  getCandles,
  getLivePrice,
  getPnL,
  getCapital,
  getMemoryState,
  setMemoryState,
  resetState,
  placeMarketOrder,
  getWalletBalance,
  getOpenPositions,
  executeTrade,
};
