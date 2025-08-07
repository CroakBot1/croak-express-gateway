require("dotenv").config();
const express = require("express");
const { WebsocketClient, RestClientV5 } = require("bybit-api");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const restClient = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: process.env.BYBIT_MODE !== "live"
});

app.post("/signal", async (req, res) => {
  const { action, symbol, qty } = req.body;

  try {
    const side = action.toUpperCase(); // BUY or SELL

    const order = await restClient.submitOrder({
      category: "linear",
      symbol: symbol || "ETHUSDT",
      side: side,
      orderType: "Market",
      qty: qty || "0.01",
      timeInForce: "GoodTillCancel"
    });

    console.log(`✅ ${side} executed`, order);
    res.json({ status: "success", order });
  } catch (err) {
    console.error("❌ Error placing order", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
