// == BYBIT CLIENT WRAPPER (V5 API) ==
// Updated to support Bybit's new V5 unified API

require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");
const logger = require("./logger");

const BASE_URL = process.env.BYBIT_API_URL || "https://api.bybit.com";
const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;

console.log("[🛠 DEBUG] BYBIT_API_KEY is", API_KEY ? "SET" : "MISSING");
console.log("[🛠 DEBUG] BYBIT_API_SECRET is", API_SECRET ? "SET" : "MISSING");

// =============== 🔐 SIGNING FUNCTION ===============
function signRequest(params) {
  const sorted = Object.keys(params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

  const query = Object.entries(sorted)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  const hash = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");
  return hash;
}

// =============== ⚙️ AUTH REQUEST WRAPPER ===============
async function privateRequest(method, endpoint, params = {}) {
  const timestamp = Date.now().toString();

  const query = {
    apiKey: API_KEY,
    timestamp,
    recvWindow: 5000,
    ...params,
  };

  const sign = signRequest(query);
  const finalParams = { ...query, sign };

  try {
    const res = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      params: finalParams,
    });
    return res.data.result;
  } catch (err) {
    logger.error(`❌ ${endpoint} ERROR`, err.response?.data || err.message);
    return null;
  }
}

// =============== 📈 MARKET DATA (PUBLIC) ===============
async function getCandles(symbol = "ETHUSDT", interval = "1") {
  try {
    const { list } = (await axios.get(`${BASE_URL}/v5/market/kline`, {
      params: {
        category: "linear",
        symbol,
        interval,
        limit: 200,
      },
    })).data.result;

    return list.map(c => ({
      timestamp: Number(c[0]),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
      volume: parseFloat(c[5]),
    }));
  } catch (err) {
    logger.error("❌ CANDLES ERROR", err.message);
    return [];
  }
}

async function getLivePrice(symbol = "ETHUSDT") {
  try {
    const { list } = (await axios.get(`${BASE_URL}/v5/market/tickers`, {
      params: {
        category: "linear",
        symbol,
      },
    })).data.result;

    const price = parseFloat(list[0].lastPrice);
    logger.info(`[📈 LIVE PRICE] ${symbol}: ${price}`);
    return price;
  } catch (err) {
    logger.error("❌ LIVE PRICE ERROR", err.message);
    return 0;
  }
}

// =============== 💼 ACCOUNT DATA (PRIVATE) ===============
async function getWalletBalance(coin = "USDT") {
  const res = await privateRequest("GET", "/v5/account/wallet-balance", {
    accountType: "UNIFIED",
  });
  const balance = res?.list?.[0]?.coin?.find(c => c.coin === coin)?.availableToWithdraw || 0;
  logger.info(`[💰 BALANCE] ${coin}: ${balance}`);
  return parseFloat(balance);
}

async function getCapital() {
  return await getWalletBalance("USDT");
}

async function getOpenPositions(symbol = "ETHUSDT") {
  const res = await privateRequest("GET", "/v5/position/list", {
    category: "linear",
    symbol,
  });
  return res?.list || [];
}

async function getPnL(symbol = "ETHUSDT") {
  const positions = await getOpenPositions(symbol);
  if (!positions.length) return 0;
  const pos = positions[0];
  const pnl = parseFloat(pos.unrealisedPnl || 0);
  logger.info(`[📊 PnL] ${symbol}: ${pnl}`);
  return pnl;
}

// =============== 🛒 ORDER EXECUTION ===============
async function placeMarketOrder(symbol, side, qty) {
  const res = await privateRequest("POST", "/v5/order/create", {
    category: "linear",
    symbol,
    side, // "Buy" or "Sell"
    orderType: "Market",
    qty,
    timeInForce: "GoodTillCancel",
  });
  logger.info(`[LIVE ORDER] ${side} ${qty} ${symbol}`, res);
  return res;
}

async function executeTrade(symbol, action, qty) {
  const side = action.toUpperCase() === "BUY" ? "Buy" : "Sell";
  return await placeMarketOrder(symbol, side, qty);
}

// =============== 🧠 MEMORY ===============
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

// =============== 📦 EXPORTS ===============
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
