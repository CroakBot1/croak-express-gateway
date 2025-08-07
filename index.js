import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { LinearClient } from 'bybit-api';

dotenv.config();
const app = express();
app.use(bodyParser.json());

const client = new LinearClient({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: false,
});

app.post('/signal', async (req, res) => {
  const { signal } = req.body;
  console.log(`📡 Received signal: ${signal}`);

  try {
    const symbol = 'BTCUSDT';
    const qty = 0.01;

    if (signal === 'BUY') {
      const order = await client.placeActiveOrder({
        symbol,
        side: 'Buy',
        order_type: 'Market',
        qty,
        time_in_force: 'GoodTillCancel',
      });
      console.log('✅ BUY Order Sent:', order);
      res.send({ status: 'BUY Executed', order });
    } else if (signal === 'SELL') {
      const order = await client.placeActiveOrder({
        symbol,
        side: 'Sell',
        order_type: 'Market',
        qty,
        time_in_force: 'GoodTillCancel',
      });
      console.log('✅ SELL Order Sent:', order);
      res.send({ status: 'SELL Executed', order });
    } else {
      res.status(400).send({ error: 'Invalid signal' });
    }
  } catch (err) {
    console.error('❌ Trade Error:', err);
    res.status(500).send({ error: 'Trade failed', details: err });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Backend running on port ${process.env.PORT || 3000}`);
});
