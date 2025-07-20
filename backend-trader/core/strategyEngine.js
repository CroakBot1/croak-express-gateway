// strategyEngine.js
const getETHPrice = require('./priceFetcher');
const brain = require('./brain');
const swapETHForToken = require('./uniswapExecutor');

let memory = {};

async function runLoop() {
  const price = await getETHPrice();
  if (!price) return;

  const decision = brain.analyzeCandle({ price }, memory);

  console.log(`[🧠 BRAIN] Action: ${decision.action} | Score: ${decision.confidence}`);

  if (decision.action === 'BUY') {
    await swapETHForToken("0xTokenYouWantToBuy", "0.01"); // 0.01 ETH
    console.log("✅ Bought token");
  }

  // TODO: Add SELL logic (reverse swap)
}

module.exports = runLoop;

