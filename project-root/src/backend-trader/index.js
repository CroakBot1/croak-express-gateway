const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { checkTradeOpportunity } = require('./strategy');
const logger = require('./logger');

logger.info("✅ CROAK BOT 24/7 is now running...");

app.get('/', (req, res) => {
  res.send("🐸 CROAK BOT LIVE — Uniswap via Bybit Feed");
});

setInterval(async () => {
  const now = new Date().toLocaleString();
  logger.heartbeat(`[${now}] Auto-check started...`);
  await checkTradeOpportunity();
}, 10 * 1000); // every 10s

app.listen(PORT, () => {
  logger.info(`🚀 Express server listening on port ${PORT}`);
});

