require("dotenv").config();
const { brainDecision } = require("./brain");
const bybit = require("./utils/bybit");
const logger = require("./utils/logger");

const SYMBOL = "ETHUSDT";
const QTY = parseFloat(process.env.DEFAULT_QTY || 0.05);
const TRAILING_STOP_PERCENT = 0.5; // Adjust trailing stop %

let trailingStopActive = false;
let highestPrice = 0;

// 🔁 AUTO LOOP
const runAutoTrade = async () => {
  while (true) {
    try {
      // 🧠 Fetch live data
      const candles = await bybit.getCandles(SYMBOL);
      const livePrice = await bybit.getLivePrice(SYMBOL);
      const volume = candles.at(-1)?.volume || 0;
      const momentum = livePrice - candles.at(-2)?.close || 0;
      const pnl = await bybit.getPnL();
      const capital = await bybit.getCapital();
      const memoryState = await bybit.getMemoryState();

      // 🤖 Brain decision
      const decision = brainDecision({
        candles,
        memoryState,
        livePrice,
        volume,
        momentum,
        sentiment: null,
        pnl,
        capital,
        externalOverride: null,
      });

      logger.decision(decision.action, decision.confidence, decision.reasons);

      // 🟢 Execute BUY
      if (decision.action === "buy") {
        await bybit.executeTrade(SYMBOL, "buy", QTY);
        logger.execution("BUY", livePrice, QTY, SYMBOL);
        trailingStopActive = true;
        highestPrice = livePrice;
      }

      // 🔴 Execute SELL
      else if (decision.action === "sell") {
        await bybit.executeTrade(SYMBOL, "sell", QTY);
        logger.execution("SELL", livePrice, QTY, SYMBOL);
        trailingStopActive = false;
        highestPrice = 0;
      }

      // 📉 Trailing Stop Logic
      else if (trailingStopActive) {
        if (livePrice > highestPrice) highestPrice = livePrice;

        const stopTrigger = highestPrice * (1 - TRAILING_STOP_PERCENT / 100);

        if (livePrice < stopTrigger) {
          await bybit.executeTrade(SYMBOL, "sell", QTY);
          logger.execution("TRAILING STOP SELL", livePrice, QTY, SYMBOL);
          trailingStopActive = false;
          highestPrice = 0;
        }
      }

      // ❌ No action
      else {
        logger.info("Waiting... no valid trade signal");
      }

      logger.trackDecision(decision);

    } catch (err) {
      logger.error("AUTO TRADE ERROR", err.message);
    }

    await new Promise(res => setTimeout(res, 7000)); // every 7s
  }
};

runAutoTrade();
