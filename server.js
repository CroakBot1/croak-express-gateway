const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ BYBIT API CREDENTIALS – FOR TESTNET ONLY
const apiKey = "4V7w7VSkgk8qVJ5YTq";
const apiSecret = "lYW7O9GGisZyBWouw1hNgNGtQuV3vMfcieFZ";

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Debug Root
app.get('/', (req, res) => {
  res.send('🟢 Croak Express Gateway is Running!');
});

// ✅ Place Order Endpoint
app.post('/place-order', async (req, res) => {
  const {
    category,
    symbol,
    side,
    orderType,
    qty,
    takeProfit,
    stopLoss,
    timeInForce
  } = req.body;

  const timestamp = Date.now().toString();
  const recvWindow = "5000";

  const params = {
    category,
    symbol,
    side,
    orderType,
    qty,
    timeInForce,
    takeProfit,
    stopLoss
  };

  const sortedParams = Object.entries(params)
    .filter(([, val]) => val !== undefined && val !== null)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

  const query = `apiKey=${apiKey}&${sortedParams}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(query)
    .digest('hex');

  const url = `https://api-testnet.bybit.com/v5/order/create`;

  try {
    console.log(`📦 Sending Order to Bybit:`, params);
    console.log(`🕒 Timestamp: ${timestamp}`);
    console.log(`🔐 Signature: ${signature}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BYBIT-API-KEY': apiKey,
        'X-BYBIT-SIGN': signature,
        'X-BYBIT-TIMESTAMP': timestamp,
        'X-BYBIT-RECV-WINDOW': recvWindow
      },
      body: JSON.stringify(params)
    });

    const result = await response.json();
    console.log("✅ Order Response:", result);
    res.json(result);
  } catch (error) {
    console.error("❌ Order Failed:", error);
    res.status(500).json({ error: 'Order Failed', detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
