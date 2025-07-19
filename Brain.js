// == BACKEND 61K QUANTUM CROAK BOT ==
// Main file: brain.js (to be imported in server.js)

const trapLayer = require("./trapLayer");
const vetoLayer = require("./vetoLayer");
const memoryCore = require("./memoryCore");
const sentimentLayer = require("./sentimentLayer");
const logger = require("../utils/logger");

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

  // ❤️ Quantum Heartbeat Ping System
  logger.heartbeat();

  // 📊 Candle Pattern Reader Layer
  const candleSignal = analyzeCandlePatterns(candles);
  if (candleSignal !== "wait") {
    decision.action = candleSignal;
    decision.confidence += 25;
    decision.reason.push("Candle Pattern Match");
  }

  // 🧬 Candle Confidence Score System™
  const candleScore = computeCandleConfidence(candles);
  decision.confidence += candleScore;
  decision.reason.push(`Candle Confidence +${candleScore}`);

  // 📈 Volume + Momentum Validator
  if (validateVolumeMomentum(volume, momentum)) {
    decision.confidence += 10;
    decision.reason.push("Volume/Momentum OK");
  }

  // 📼 Live Candle Memory Scanner
  const memoryScore = memoryCore.evaluate(memoryState, candles);
  decision.confidence += memoryScore;
  decision.reason.push("Memory Score +" + memoryScore);

  // 🧩 Trap Detection Filters (v3 Ultra)
  if (trapLayer.detectUltra(candles, livePrice)) {
    decision.action = "wait";
    decision.reason.push("Trap Filter Triggered");
    return decision;
  }

  // 🚫 Auto-Denial Veto™ – Final Judgment Layer
  if (vetoLayer.shouldBlock(decision)) {
    decision.action = "wait";
    decision.reason.push("Auto-Vetoed");
    return decision;
  }

  // 🔒 Risk Guard Layer v2 – Anti-Bogok BUY Protection™
  if (!riskCheck(decision, capital, pnl)) {
    decision.action = "wait";
    decision.reason.push("RiskGuard Blocked");
    return decision;
  }

  // 🔍 Hot Entry / Exit Scanners
  if (hotEntryScan(candles)) {
    decision.confidence += 10;
    decision.reason.push("Hot Entry Scanner");
  }
  if (hotExitScan(candles)) {
    decision.confidence -= 5;
    decision.reason.push("Hot Exit Signal");
  }

  // 🌀 Real-Time Candle Decision Engine
  if (decision.confidence > 60) {
    decision.action = decision.action || candleSignal;
  }

  // 🗣️ Voice Alerts + Smart Duration (optional frontend call)
  // logger.voiceAlert(decision);

  // 🧱 TP EXTENDER: Trillions Foundation
  if (decision.action !== "wait") {
    decision.tpExtended = true;
    decision.reason.push("TP Extender Enabled");
  }

  // ⛔ External Override (Strategy Override Panel)
  if (externalOverride) {
    decision.action = externalOverride.action;
    decision.reason.push("External Override Applied");
  }

  // ✅ Finalize
  logger.trackDecision(decision);
  return decision;
}

// 🔎 Core Logic Modules Below:
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

module.exports = {
  brainDecision
};
  
