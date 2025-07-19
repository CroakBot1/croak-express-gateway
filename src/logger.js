// src/utils/logger.js

function info(...args) {
  console.log('[ℹ️ INFO]', ...args);
}

function warn(...args) {
  console.warn('[⚠️ WARN]', ...args);
}

function error(...args) {
  console.error('[❌ ERROR]', ...args);
}

function heartbeat(msg = "💓 CROAK Loop is alive") {
  console.log(`[HEARTBEAT] ${msg}`);
}

function trackDecision(decision) {
  console.log(`[🤖 DECISION] Action: ${decision.action} | Confidence: ${decision.confidence} | Reasons: ${decision.reason.join(", ")}`);
}

module.exports = {
  info,
  warn,
  error,
  heartbeat,
  trackDecision
};
