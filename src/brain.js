const trapLayer = require("./trapLayer");
const vetoLayer = require("./vetoLayer");
const memoryCore = require("./memoryCore");
const sentimentLayer = require("./sentimentLayer");
const logger = require("./utils/logger"); // ✅ FIXED: Correct path
const axios = require("axios");

let brainMemory = {};

function brainDecision(priceData, memory) {
  const decisionLog = [];
  let action = "hold";
  let confidence = 50;

  // Sentiment analysis
  const sentiment = sentimentLayer.analyze(priceData);
  decisionLog.push(`[🧠 SENTIMENT] ${sentiment}`);
  if (sentiment === "bullish") confidence += 10;
  if (sentiment === "bearish") confidence -= 10;

  // Trap detection
  const trapSignal = trapLayer.detect(priceData);
  decisionLog.push(`[⚠️ TRAP DETECTION] ${trapSignal}`);
  if (trapSignal === "bull") confidence -= 15;
  if (trapSignal === "bear") confidence += 15;

  // Memory-based adjustments
  const memorySignal = memoryCore.evaluate(memory, priceData);
  decisionLog.push(`[🧬 MEMORY CORE] ${memorySignal}`);
  if (memorySignal === "favorable") confidence += 5;
  if (memorySignal === "unfavorable") confidence -= 5;

  // Final veto check
  const veto = vetoLayer.veto(priceData, confidence);
  decisionLog.push(`[🚫 VETO LAYER] ${veto}`);
  if (veto === "deny") {
    action = "hold";
    confidence = 0;
  }

  // Decide action based on confidence
  if (confidence >= 70) action = "buy";
  else if (confidence <= 30) action = "sell";

  return {
    action,
    confidence,
    reasons: decisionLog,
  };
}

async function fetchPriceData() {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    return { price: response.data.ethereum.usd };
  } catch (error) {
    logger.error("Failed to fetch price data:", error.message);
    return { price: null };
  }
}

async function runCROAKLoop() {
  logger.heartbeat();

  const priceData = await fetchPriceData();
  if (!priceData.price) return;

  const decision = brainDecision(priceData, brainMemory);
  logger.info("[🤖 DECISION]", decision);

  brainMemory = memoryCore.update(brainMemory, priceData, decision);
}

module.exports = {
  brainDecision,
  runCROAKLoop,
};
