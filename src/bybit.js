const logger = require('./logger');
const bybitUtils = require('./utils/bybit');

// Simulated Trading Brain Execution Logic

function executeTradeLogic() {
  try {
    const balance = bybitUtils.getBalance();
    const state = bybitUtils.getMemoryState();

    // Ensure state has valid structure
    if (!state || typeof state.changePct !== 'number') {
      logger.warn('[⚠️ TRADE LOGIC WARNING] Invalid or missing state. Resetting...');
      bybitUtils.resetState();
      return;
    }

    const changePct = state.changePct;

    if (changePct > 1) {
      logger.info(`[🚀 SIGNAL] Market up (${changePct}%) – Simulate LONG`);
      bybitUtils.setMemoryState({ side: 'LONG', entryPrice: 100, qty: balance * 0.5 });
    } else if (changePct < -1) {
      logger.info(`[🩸 SIGNAL] Market down (${changePct}%) – Simulate SHORT`);
      bybitUtils.setMemoryState({ side: 'SHORT', entryPrice: 100, qty: balance * 0.5 });
    } else {
      logger.info(`[🤔 NO TRADE] Change: ${changePct}%, holding...`);
    }

  } catch (err) {
    logger.error('[❌ AUTO TRADE ERROR]', err.message || err);
  }
}

function runBot() {
  logger.heartbeat('Starting CROAK BOT run cycle...');
  executeTradeLogic();
}

module.exports = {
  runBot
};
