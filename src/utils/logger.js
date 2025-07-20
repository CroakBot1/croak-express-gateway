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
  const timestamp = new Date().toISOString();
  console.log(`[HEARTBEAT] ${msg} | ${timestamp}`);
}

function decision(action, confidence, reasons = []) {
  console.log(`[🤖 DECISION] Action: ${action} | Confidence: ${confidence} | Reasons: ${reasons.join(', ')}`);
}

function execution(status, price, qty, symbol = "ETHUSDT") {
  console.log(`[💥 EXECUTION] ${status} ${qty} ${symbol} @ ${price}`);
}

function veto(reason) {
  console.warn(`[🚫 VETO] Trade denied. Reason: ${reason}`);
}

module.exports = {
  info,
  warn,
  error,
  heartbeat,
  decision,
  execution,
  veto
};
