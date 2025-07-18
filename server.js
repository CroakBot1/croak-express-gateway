// == REQUIRED MODULES ==
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

// == CONSTANTS ==
const AUTH_TOKEN = "croakSuperSecure123";
const UUID_DATA_FILE = 'uuids.json';
const VALID_UUIDS_FILE = 'valid-uuids.json';
const IP_EXPIRY_HOURS = 24;
const BYBIT_API_KEY = 'QWTY3iAMCAzN3vVq06';
const BYBIT_API_SECRET = 'jINoNQXVoenSB5WQgAtJXiSo5q5Y75DIPWij';

// == WALLET STATE ==
let wallet = {
  CROAK: 100000000,
  PHP: 10000,
  eth: 0,
  usdt: 1000
};
let lastBuyPrice = null;

// == UTILS ==
function loadFile(path) {
  try {
    return JSON.parse(fs.readFileSync(path));
  } catch {
    return {};
  }
}
function saveFile(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
function isExpired(boundAt) {
  if (!boundAt) return true;
  const now = new Date();
  const then = new Date(boundAt);
  return (now - then) / (1000 * 60 * 60) >= IP_EXPIRY_HOURS;
}
function checkAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${AUTH_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// == ROUTES ==

// Health Checks
app.get('/', (req, res) => res.send('CROAK SERVER ACTIVE'));
app.get('/heartbeat', (req, res) => res.send('❤️ CROAK alive and listening'));
app.get('/ping', (req, res) => res.send(`🟢 Backend is alive at ${new Date().toISOString()}`));
app.get('/keep-alive', (req, res) => res.send('🟢 Croak server is alive!'));

// ✅ TEST ENDPOINT for frontend
app.post('/api/test', (req, res) => {
  console.log('✅ POST /api/test received');
  const message = req.body.message || 'No message';
  res.json({ reply: `Hello! You said: ${message}` });
});

// Wallet (CROAK + PHP) endpoints
app.get('/wallet', (req, res) => {
  if (!checkAuth(req, res)) return;
  res.json(wallet);
});
app.post('/buy', (req, res) => {
  if (!checkAuth(req, res)) return;
  const amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid buy amount" });
  const totalCost = amount * 0.001;
  if (wallet.PHP >= totalCost) {
    wallet.PHP -= totalCost;
    wallet.CROAK += amount;
    res.json({ message: "Bought CROAK", wallet });
  } else {
    res.status(400).json({ error: "Not enough PHP" });
  }
});
app.post('/sell', (req, res) => {
  if (!checkAuth(req, res)) return;
  const amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid sell amount" });
  if (wallet.CROAK >= amount) {
    wallet.CROAK -= amount;
    wallet.PHP += amount * 0.001;
    res.json({ message: "Sold CROAK", wallet });
  } else {
    res.status(400).json({ error: "Not enough CROAK" });
  }
});

// Trade simulation using ETH/USDT
app.post('/buy-sim', (req, res) => {
  if (!checkAuth(req, res)) return;
  const { price } = req.body;
  if (wallet.usdt < 10) return res.status(400).json({ error: 'Insufficient USDT' });
  const ethBought = wallet.usdt / price;
  wallet.eth += ethBought;
  wallet.usdt = 0;
  lastBuyPrice = price;
  res.json({ message: `BUY executed at $${price}`, eth: wallet.eth, usdt: wallet.usdt });
});
app.post('/sell-sim', (req, res) => {
  if (!checkAuth(req, res)) return;
  const { price } = req.body;
  if (wallet.eth < 0.001) return res.status(400).json({ error: 'Insufficient ETH' });
  const usdtReceived = wallet.eth * price;
  wallet.usdt += usdtReceived;
  wallet.eth = 0;
  res.json({ message: `SELL executed at $${price}`, eth: wallet.eth, usdt: wallet.usdt });
});

// UUID endpoints
app.post('/generate-uuid', (req, res) => {
  const uuids = loadFile(UUID_DATA_FILE);
  const newUUID = uuidv4();
  uuids[newUUID] = { ip: null, created: new Date().toISOString(), boundAt: null };
  saveFile(UUID_DATA_FILE, uuids);
  res.json({ uuid: newUUID, status: '✅ UUID generated. Not yet bound.' });
});
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });
  const uuids = loadFile(UUID_DATA_FILE);
  const data = uuids[uuid];
  if (!data) return res.status(404).json({ valid: false, message: '❌ UUID not found.' });
  if (!data.ip || isExpired(data.boundAt)) {
    data.ip = clientIP;
    data.boundAt = new Date().toISOString();
    uuids[uuid] = data;
    saveFile(UUID_DATA_FILE, uuids);
    return res.json({ valid: true, message: '✅ UUID validated and IP locked.' });
  }
  if (data.ip === clientIP) return res.json({ valid: true, message: '✅ UUID verified.' });
  return res.status(401).json({ valid: false, message: '❌ UUID is locked to a different IP.' });
});
app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const uuids = loadFile(UUID_DATA_FILE);
  const data = uuids[uuid];
  if (!data) return res.status(404).json({ unbound: false, message: '❌ UUID not found.' });
  if (data.ip === clientIP || isExpired(data.boundAt)) {
    data.ip = null;
    data.boundAt = null;
    uuids[uuid] = data;
    saveFile(UUID_DATA_FILE, uuids);
    return res.json({ unbound: true, message: '✅ UUID unbound.' });
  }
  return res.status(403).json({ unbound: false, message: '❌ IP mismatch. Cannot unbind UUID.' });
});
app.get('/register', (req, res) => {
  const uuids = loadFile(VALID_UUIDS_FILE);
  const newUUID = uuidv4();
  uuids[newUUID] = true;
  saveFile(VALID_UUIDS_FILE, uuids);
  res.json({ uuid: newUUID, message: '✅ Your UUID is now registered.' });
});
app.get('/dev-all', (req, res) => {
  const uuids = loadFile(UUID_DATA_FILE);
  res.json(uuids);
});

// BYBIT execution + price fetch
app.post('/execute-trade', async (req, res) => {
  try {
    const { symbol = 'ETHUSDT', side = 'Buy', qty = 1 } = req.body;
    const timestamp = Date.now();
    const recvWindow = 5000;
    const params = {
      api_key: BYBIT_API_KEY, symbol, side, order_type: 'MARKET',
      qty, time_in_force: 'GoodTillCancel', timestamp, recv_window: recvWindow
    };
    const paramStr = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    const sign = crypto.createHmac('sha256', BYBIT_API_SECRET).update(paramStr).digest('hex');
    const url = `https://api.bybit.com/v2/private/order/create?${paramStr}&sign=${sign}`;
    const response = await axios.post(url);
    res.json({ success: true, result: response.data });
  } catch (err) {
    console.error('🔥 Bybit order failed:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get('/bybit-price', async (req, res) => {
  try {
    const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear&symbol=ETHUSDT');
    const data = await response.json();
    const price = parseFloat(data?.result?.list?.[0]?.lastPrice);
    if (isNaN(price)) return res.status(500).json({ error: 'Invalid price value' });
    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Bybit', details: err.message });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🟢 Croak Gateway fully running on port ${PORT}`);
});
