function info(...args) {
  console.log('[ℹ️ INFO]', ...args);
}
function warn(...args) {
  console.warn('[⚠️ WARN]', ...args);
}
function error(...args) {
  console.error('[❌ ERROR]', ...args);
}
function heartbeat(msg = "💓 BOT is alive") {
  console.log(msg);
}

module.exports = { info, warn, error, heartbeat };

