const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { WebsocketClient, RestClientV5 } = require('bybit-api');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// 🔐 REST client for executing orders
const restClient = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false, // Set to true if using testnet
});

// ✅ BUY / SELL SIGNAL HANDLER
app.post('/signal', async (req, res) => {
  const { side, symbol, qty, leverage } = req.body;

  if (!side || !symbol || !qty || !leverage) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    // Set leverage
    await restClient.setLeverage({
      category: 'linear',
      symbol,
      buyLeverage: leverage,
      sellLeverage: leverage,
    });

    // Place market order
    const order = await restClient.submitOrder({
      category: 'linear',
      symbol,
      side,
      orderType: 'Market',
      qty,
      timeInForce: 'GoodTillCancel',
    });

    res.json({
      message: 'Order executed',
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to execute order', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Croak Gateway listening on port ${port}`);
});
