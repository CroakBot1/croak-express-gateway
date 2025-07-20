// src/utils/bybit.js
const axios = require('axios');
const logger = require('../logger');

// Basic config (mocked endpoints)
const SYMBOL = 'ETHUSDT';

// --------------------- MOCK DATA PROVIDERS ---------------------

async function getLivePrice() {
  try {
    // Replace with real endpoint if needed
    const mockPrice = 2850.75;
    logger.info(`[bybit.js] Mock live price fetched: ${mockPrice}`);
    return mockPrice;
  } catch (err) {
    logger.error('[getLivePrice ERROR]', err.message);
    return null;
  }
}

async function getCandles(interval = '1m', limit = 100) {
  try {
    // Replace with real candle data
    const mockCandles = Array.from({ length: limit }).map((_, i) => ({
      open: 2800 + i,
      close: 2801 + i,
      high: 2802 + i,
      low: 2799 + i,
      volume: 1000 + i,
      timestamp: Date.now() - i * 60000
    }));
    logger.info(`[bybit.js] Mock candles fetched: ${mockCandles.length} bars`);
    return mockCandles.reverse(); // ascending
  } catch (err) {
    logger.error('[getCandles ERROR]', err.message);
    return [];
  }
}

async function getPnL() {
  try {
    // Placeholder mock value
    const mockPnL = 25.75;
    logger.info(`[bybit.js] Mock PnL fetched: ${mockPnL}`);
    return mockPnL;
  } catch (err) {
    logger.error('[getPnL ERROR]', err.message);
    return null;
  }
}

async function getCapital() {
  try {
    // Placeholder mock capital
    const mockCapital = 1000;
    logger.info(`[bybit.js] Mock capital fetched: ${mockCapital}`);
    return mockCapital;
  } catch (err) {
    logger.error('[getCapital ERROR]', err.message);
    return null;
  }
}

async function buyMarket(price, qty) {
  logger.execution('BUY', price, qty);
  return { status: 'filled', price, qty };
}

async function sellMarket(price, qty) {
  logger.execution('SELL', price, qty);
  return { status: 'filled', price, qty };
}

// --------------------- EXPORTS ---------------------

module.exports = {
  getLivePrice,
  getCandles,
  getPnL,
  getCapital,
  buyMarket,
  sellMarket
};
