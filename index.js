const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const tradeLogs = [];

// ✅ Homepage
app.get('/', (req, res) => {
  res.send('✅ Croak Express Gateway is LIVE and linked to CROAK BOT 61k');
});

// ✅ ETH Price
app.get('/price', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
    const price = data.result[0].last_price;
    res.json({ pair: 'ETHUSDT', price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ETH price' });
  }
});

// ✅ BTC Price
app.get('/btcprice', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=BTCUSDT');
    const price = data.result[0].last_price;
    res.json({ pair: 'BTCUSDT', price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
});

// ✅ Status Checker
app.get('/status', (req, res) => {
  res.json({ status: 'ok', connected: true, time: new Date().toISOString() });
});

// ✅ Simulated Trade Endpoint
app.post('/trade', (req, res) => {
  const { side, symbol, qty } = req.body;
  const trade = {
    id: tradeLogs.length + 1,
    side,
    symbol,
    qty,
    time: new Date().toISOString()
  };
  tradeLogs.push(trade);
  console.log(`🟢 TRADE EXECUTED:`, trade);
  res.json({
    success: true,
    message: 'Simulated trade executed (testnet)',
    trade
  });
});

// ✅ Memory Log
app.get('/memory', (req, res) => {
  res.json({ trades: tradeLogs, total: tradeLogs.length });
});

// ✅ Full Log
app.get('/log', (req, res) => {
  res.json(tradeLogs);
});

// ✅ Trigger Bot Command
app.post('/trigger', (req, res) => {
  const { action } = req.body;
  console.log(`🚨 TRIGGERED ACTION: ${action}`);
  res.json({ received: true, action });
});

app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway running at http://localhost:${PORT}`);
});
