require("dotenv").config();
const { brainDecision } = require("./brain");
const bybit = require("./utils/bybit");
const logger = require("./utils/logger");

const SYMBOL = "ETHUSDT"; // or load dynamically
const QTY = parseFloat(process.env.DEFAULT_QTY || 0.05);

// 🔁 AUTO LOOP
const runAutoTrade = async () => {
  while (true) {
    try {
      // 1. Fetch real-time data (candles, price, volume, etc.)
      const candles = await bybit.getCandles(SYMBOL);
      const livePrice = await bybit.getLivePrice(SYMBOL);
      const volume = candles.at(-1)?.volume || 0;
      const momentum = livePrice - candles.at(-2)?.close || 0;
      const pnl = await bybit.getPnL();
      const capital = await bybit.getCapital();
      const memoryState = await bybit.getMemoryState();

      // 2. Make brain decision
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

      console.log(`[🧠 DECISION]`, decision);

      // 3. Execute trade
      if (decision.action === "buy" || decision.action === "sell") {
        await bybit.executeTrade(SYMBOL, decision.action, QTY);
        console.log(`[🚀 TRADE EXECUTED] ${decision.action.toUpperCase()} @ ${livePrice}`);
      } else {
        console.log("[⏳ WAITING] No valid signal...");
      }

      // 4. Track decision (optional log to DB)
      logger.trackDecision(decision);

    } catch (err) {
      console.error("[❌ AUTO TRADE ERROR]", err.message);
    }

    await new Promise(res => setTimeout(res, 7000)); // every 7s
  }
};

runAutoTrade();
        
