// backend/index.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { LinearClient } from 'bybit-api';

dotenv.config();
const app = express();
app.use(bodyParser.json());

// 🔐 Connect to Bybit MAINNET
const client = new LinearClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false, // << MAINNET LIVE
});

// ✅ Signal endpoint (from frontend)
app.post('/signal', async (req, res) => {
  const { signal } = req.body;
  const timestamp = new Date().toLocaleString();

  console.log(`📡 [${timestamp}] Received signal: ${signal}`);

  try {
    const symbol = 'BTCUSDT'; // Or any other trading pair
    const qty = 0.01;         // Adjust your trading quantity here

    // 🚀 Execute Buy Order
    if (signal === 'BUY') {
      const order = await client.placeActiveOrder({
        symbol,
        side: 'Buy',
        order_type: 'Market',
        qty,
        time_in_force: 'GoodTillCancel',
      });
      console.log('✅ BUY Order Sent:', order);
      res.send({ status: 'BUY Executed', time: timestamp, order });

    // 🧨 Execute Sell Order
    } else if (signal === 'SELL') {
      const order = await client.placeActiveOrder({
        symbol,
        side: 'Sell',
        order_type: 'Market',
        qty,
        time_in_force: 'GoodTillCancel',
      });
      console.log('✅ SELL Order Sent:', order);
      res.send({ status: 'SELL Executed', time: timestamp, order });

    } else {
      res.status(400).send({ error: 'Invalid signal' });
    }
  } catch (err) {
    console.error('❌ Trade Error:', err);
    res.status(500).send({ error: 'Trade failed', details: err.message });
  }
});

// 🟢 Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Backend live on port ${process.env.PORT || 3000}`);
});
