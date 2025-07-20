// === backend-trader/index.js ===
require('dotenv').config();
const { fetchPrice } = require('./core/priceFetcher');
const { shouldBuy, shouldSell } = require('./core/strategyEngine');
const { executeTrade } = require('./core/uniswapExecutor');
const fs = require('fs');

async function loop() {
  try {
    const price = await fetchPrice();
    const log = `[${new Date().toISOString()}] Price: $${price}\n`;
    fs.appendFileSync('./log/trade.log', log);

    if (shouldBuy(price)) {
      await executeTrade('buy');
    } else if (shouldSell(price)) {
      await executeTrade('sell');
    }
  } catch (err) {
    console.error('Loop Error:', err);
  }
}

setInterval(loop, 15000); // run every 15s
