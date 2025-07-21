const { getBybitPrice } = require('./priceFetcher');
const { executeTrade } = require('./trader');
const logger = require('./logger');

async function checkTradeOpportunity() {
  const price = await getBybitPrice("ETHUSDT");

  if (!price) return;

  logger.info(`📈 ETH Price from Bybit: $${price}`);

  // Example logic (replace with real one):
  if (price < 2900) {
    logger.warn("🔽 Price low! Considering buy...");
    await executeTrade("BUY");
  } else if (price > 3600) {
    logger.warn("🔼 Price high! Considering sell...");
    await executeTrade("SELL");
  } else {
    logger.info("⏸ No trade condition met.");
  }
}

module.exports = { checkTradeOpportunity };

