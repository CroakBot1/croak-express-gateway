// == CROAK GATEWAY FULL SERVER WITH LIVE BYBIT EXECUTION 🔐🐸 ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const fetch = require('node-fetch');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// == AUTH TOKEN ==
const AUTH_TOKEN = "croakSuperSecure123"; // must match frontend

// == FILE PATHS ==
const UUID_DATA_FILE = 'uuids.json';
const VALID_UUIDS_FILE = 'valid-uuids.json';
const IP_EXPIRY_HOURS = 24;

// == API KEYS (Mainnet) ==
const BYBIT_API_KEY = 'QWTY3iAMCAzN3vVq06';
const BYBIT_API_SECRET = 'jINoNQXVoenSB5WQgAtJXiSo5q5Y75DIPWij';

// == HELPERS: File Utilities ==
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

// == EXPIRY CHECKER ==
function isExpired(boundAt) {
  if (!boundAt) return true;
  const now = new Date();
  const then = new Date(boundAt);
  const hoursPassed = (now - then) / (1000 * 60 * 60);
  return hoursPassed >= IP_EXPIRY_HOURS;
}

// == BYBIT LIVE ORDER EXECUTION ==
async function executeBybitOrder({ symbol, side, qty, type = 'MARKET', category = 'linear' }) {
  const timestamp = Date.now();
  const recvWindow = 5000;

  const params = {
    api_key: BYBIT_API_KEY,
    symbol,
    side,
    order_type: type,
    qty,
    time_in_force: 'GoodTillCancel',
    timestamp,
    recv_window: recvWindow
  };

  const paramStr = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const sign = crypto.createHmac('sha256', BYBIT_API_SECRET).update(paramStr).digest('hex');

  const url = `https://api.bybit.com/v2/private/order/create?${paramStr}&sign=${sign}`;

  try {
    const response = await axios.post(url);
    return response.data;
  } catch (err) {
    console.error('🔥 Bybit order failed:', err.response?.data || err.message);
    throw err;
  }
}

app.post('/execute-trade', async (req, res) => {
  const { symbol = 'ETHUSDT', side = 'Buy', qty = 1 } = req.body;
  try {
    const result = await executeBybitOrder({ symbol, side, qty });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// == UUID SYSTEM ==
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

  if (data.ip === clientIP) {
    return res.json({ valid: true, message: '✅ UUID verified.' });
  }

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

// == REGISTER UUID (Permanent) ==
app.get('/register', (req, res) => {
  const uuids = loadFile(VALID_UUIDS_FILE);
  const newUUID = uuidv4();
  uuids[newUUID] = true;
  saveFile(VALID_UUIDS_FILE, uuids);
  res.json({ uuid: newUUID, message: '✅ Your UUID is now registered.' });
});

// == LIVE PRICE FETCH ==
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

// == HEARTBEAT & KEEP-ALIVE ==
app.get('/heartbeat', (req, res) => {
  res.send('❤️ CROAK alive and listening');
});
app.get('/ping', (req, res) => {
  res.send(`🟢 Backend is alive at ${new Date().toISOString()}`);
});
app.get('/keep-alive', (req, res) => {
  res.send('🟢 Croak server is alive!');
});

// == SIMULATED WALLET (Auth-Protected) ==
let wallet = { eth: 0, usdt: 1000 };
let lastBuyPrice = null;

app.get('/wallet', (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json(wallet);
});

// == TRADE SIMULATION ==
app.post('/buy', (req, res) => {
  const { price } = req.body;
  if (wallet.usdt < 10) return res.status(400).json({ error: 'Insufficient USDT' });

  const ethBought = wallet.usdt / price;
  wallet.eth += ethBought;
  wallet.usdt = 0;
  lastBuyPrice = price;

  res.json({ message: `BUY executed at $${price}`, eth: wallet.eth, usdt: wallet.usdt });
});

app.post('/sell', (req, res) => {
  const { price } = req.body;
  if (wallet.eth < 0.001) return res.status(400).json({ error: 'Insufficient ETH' });

  const usdtReceived = wallet.eth * price;
  wallet.usdt += usdtReceived;
  wallet.eth = 0;

  res.json({ message: `SELL executed at $${price}`, eth: wallet.eth, usdt: wallet.usdt });
});

// == DEV UUID DUMP ==
app.get('/dev-all', (req, res) => {
  const uuids = loadFile(UUID_DATA_FILE);
  res.json(uuids);
});

app.listen(PORT, () => {
  console.log(`🟢 Croak Gateway running on port ${PORT}`);
});
