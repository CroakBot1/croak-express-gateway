// == BACKEND: BUY ORDER ROUTE ==
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.post("/place-order", async (req, res) => {
  const {
    apiKey,
    apiSecret,
    symbol,
    side,
    orderType,
    qty,
    price,
    timeInForce,
  } = req.body;

  const timestamp = Date.now().toString();

  const query = `apiKey=${apiKey}&orderType=${orderType}&price=${price}&qty=${qty}&side=${side}&symbol=${symbol}&timeInForce=${timeInForce}&timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", apiSecret).update(query).digest("hex");

  try {
    const response = await axios.post(
      "https://api.bybit.com/v5/order/create",
      {
        category: "linear",
        symbol,
        side,
        orderType,
        qty,
        price,
        timeInForce,
      },
      {
        headers: {
          "X-BYBIT-API-KEY": 4V7w7VSkgk8qVJ5YTq,
          "X-BYBIT-API-SIGN": lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ,
          "X-BYBIT-API-TIMESTAMP": timestamp,
          "X-BYBIT-API-RECV-WINDOW": "5000",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, result: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
