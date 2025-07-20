// src/utils/bybit.js

const logger = require('./logger');
const axios = require('axios');

const MOCK_CAPITAL = 1000;

function getMockCapital() {
  logger.info('[💰 MOCK CAPITAL] Returning default', MOCK_CAPITAL, 'USDT');
  return MOCK_CAPITAL;
}

function getMockMemoryState() {
  logger.info('[🧠 MOCK MEMORY STATE] Returning default memory state');
  return {
    entryPrice: 0,
    positionSize: 0,
    direction: null,
    pnl: 0,
    changePct: 0
  };
}

async function placeMockOrder({ side, qty, price }) {
  logger.execution('MOCK ORDER PLACED', price, qty, 'ETHUSDT');
  return {
    success: true,
    data: {
      orderId: 'MOCK-' + Date.now(),
      side,
      qty,
      price
    }
  };
}

async function getMockMarketData(symbol = 'ETHUSDT') {
  try {
    const response = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=' + symbol);
    const ticker = response.data.result[0];
    return {
      lastPrice: parseFloat(ticker.last_price),
      markPrice: parseFloat(ticker.mark_price),
      indexPrice: parseFloat(ticker.index_price)
    };
  } catch (err) {
    logger.error('[📉 MARKET FETCH ERROR]', err.message);
    return {
      lastPrice: 0,
      markPrice: 0,
      indexPrice: 0
    };
  }
}

module.exports = {
  getCapital: getMockCapital,
  getMemoryState: getMockMemoryState,
  placeOrder: placeMockOrder,
  getMarketData: getMockMarketData
};
