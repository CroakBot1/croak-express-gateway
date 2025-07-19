// == BACKEND 61K QUANTUM CROAK BOT ==
// Main file: brain.js (Autonomous Mode)

const trapLayer = require("./trapLayer");
const vetoLayer = require("./vetoLayer");
const memoryCore = require("./memoryCore");
const sentimentLayer = require("./sentimentLayer");
const logger = require("../utils/logger");
const axios = require("axios");

// == CORE STRATEGY ==
function brainDecision({
  candles,
  memoryState,
  livePrice,
  volume,
  momentum,
  sentiment,
  pnl,
  capital,
  externalOverride
}) {
  let decision = {
    action: "wait",
    confidence: 0,
    reason: [],
    timestamp: Date.now(),
  };

  logger.heartbeat();

  const candleSignal = analyzeCandlePatterns(candles);
  if (candleSignal !== "wait") {
    decision.action = candleSignal;
    decision.confidence += 25;
    decision.reason.push("Candle Pattern Match");
  }

  const candleScore = computeCandleConfidence(candles);
  decision.confidence += candleScore;
  decision.reason.push(`Candle Confidence +${candleScore}`);

  if (validateVolumeMomentum(volume, momentum)) {
    decision.confidence += 10;
    decision.reason.push("Volume/Momentum OK");
  }

  const memoryScore = memoryCore.evaluate(memoryState, candles);
  decision.confidence += memoryScore;
  decision.reason.push("Memory Score +" + memoryScore);

  if (trapLayer.detectUltra(candles, livePrice)) {
    decision.action = "wait";
    decision.reason.push("Trap Filter Triggered");
    return decision;
  }

  if (vetoLayer.shouldBlock(decision)) {
    decision.action = "wait";
    decision.reason.push("Auto-Vetoed");
    return decision;
  }

  if (!riskCheck(decision, capital, pnl)) {
    decision.action = "wait";
    decision.reason.push("RiskGuard Blocked");
    return decision;
  }

  if (hotEntryScan(candles)) {
    decision.confidence += 10;
    decision.reason.push("Hot Entry Scanner");
  }

  if (hotExitScan(candles)) {
    decision.confidence -= 5;
    decision.reason.push("Hot Exit Signal");
  }

  if (decision.confidence > 60) {
    decision.action = decision.action || candleSignal;
  }

  if (decision.action !== "wait") {
    decision.tpExtended = true;
    decision.reason.push("TP Extender Enabled");
  }

  if (externalOverride) {
    decision.action = externalOverride.action;
    decision.reason.push("External Override Applied");
  }

  logger.trackDecision(decision);
  return decision;
}

// == SUPPORTING FUNCTIONS ==
function analyzeCandlePatterns(candles) {
  const last = candles[candles.length - 1];
  if (last.close > last.open) return "buy";
  if (last.close < last.open) return "sell";
  return "wait";
}

function computeCandleConfidence(candles) {
  const last = candles[candles.length - 1];
  const body = Math.abs(last.close - last.open);
  const range = Math.abs(last.high - last.low);
  return Math.min(15, (body / range) * 100);
}

function validateVolumeMomentum(volume, momentum) {
  return volume > 0 && Math.abs(momentum) > 0.01;
}

function hotEntryScan(candles) {
  const last = candles[candles.length - 1];
  return last.volume > 500000 && last.close > last.open;
}

function hotExitScan(candles) {
  const last = candles[candles.length - 1];
  return last.volume > 500000 && last.close < last.open;
}

function riskCheck(decision, capital, pnl) {
  return decision.confidence >= 40 && capital > 10 && pnl > -50;
}

// == AUTONOMOUS LOOP ==
const runCROAKLoop = async () => {
  while (true) {
    try {
      const { candles, price, volume, momentum, pnl, capital } = await fetchMarketData();
      const memoryState = {}; // optional state tracking
      const sentiment = sentimentLayer.analyze(); // optional

      const decision = brainDecision({
        candles,
        memoryState,
        livePrice: price,
        volume,
        momentum,
        sentiment,
        pnl,
        capital
      });

      if (decision.action === "buy" || decision.action === "sell") {
        await CROAK_EXECUTE(decision.action, 0.05); // 🔥 Real execution
        console.log(`[🚀 TRADE EXECUTED] ${decision.action.toUpperCase()} @ ${price}`);
      } else {
        console.log(`[⏳ NO TRADE] Confidence: ${decision.confidence} | ${decision.reason.join(", ")}`);
      }

    } catch (err) {
      console.error("[❌ CROAK LOOP ERROR]", err);
    }

    await new Promise((res) => setTimeout(res, 6000)); // ⏱️ wait 6 seconds
  }
};

async function fetchMarketData() {
  const priceRes = await axios.get("https://api.bybit.com/v5/market/tickers?category=linear&symbol=ETHUSDT");
  const price = parseFloat(priceRes.data.result.list[0].lastPrice);

  const candleRes = await axios.get("https://api.bybit.com/v5/market/kline?category=linear&symbol=ETHUSDT&interval=1&limit=10");
  const candles = candleRes.data.result.list.map(c => ({
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5])
  }));

  return {
    price,
    candles,
    volume: candles[candles.length - 1].volume,
    momentum: price - candles[candles.length - 2].close,
    pnl: 10, // fake PnL, replace if needed
    capital: 100 // fake capital, replace if needed
  };
}

// == LIVE TRADE EXECUTION ==
async function CROAK_EXECUTE(side = "buy", qty = 0.05) {
  const api_key = process.env.BYBIT_API_KEY;
  const api_secret = process.env.BYBIT_API_SECRET;
  const timestamp = Date.now();
  const recv_window = 5000;

  const params = {
    api_key,
    symbol: "ETHUSDT",
    side: side.toUpperCase(),
    order_type: "MARKET",
    qty,
    time_in_force: "GoodTillCancel",
    timestamp,
    recv_window
  };

  const paramStr = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  const sign = require("crypto").createHmac('sha256', api_secret).update(paramStr).digest('hex');
  const url = `https://api.bybit.com/v2/private/order/create?${paramStr}&sign=${sign}`;

  const res = await axios.post(url);
  return res.data;
}

// == START BOT ==
runCROAKLoop();
  
