// src/logger.js

function info(...args) {
  console.log('[ℹ️ INFO]', ...args);
}

function warn(...args) {
  console.warn('[⚠️ WARN]', ...args);
}

function error(...args) {
  console.error('[❌ ERROR]', ...args);
}

function log(...args) {
  console.log('[LOG]', ...args);
}

function heartbeat(msg = "💓 CROAK BOT HEARTBEAT – Loop is alive") {
  console.log(`[HEARTBEAT] ${msg}`);
}

module.exports = {
  info,
  warn,
  error,
  log,
  heartbeat,
};
