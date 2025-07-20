require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const crypto = require('crypto');
const { info, error } = require('./utils/logger');
const runAutoTrade = require('./auto-trade-runner');

const app = express();
const PORT = process.env.PORT || 3000;

// === ENV CONFIG ===
const BYBIT_API_KEY = process.env.BYBIT_API_KEY;
const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET;
const TRADE_SYMBOL = process.env.TRADE_SYMBOL || 'ETHUSDT';
const TRADE_QTY = parseFloat(process.env.TRADE_QTY || '0.01');
const SESSION_FILE = 'uuids.json';
const VALID_UUIDS_FILE = 'valid-uuids.json';
const IP_EXPIRY_HOURS = 24;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// === UTILITIES ===
function loadJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return {};
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function isExpired(boundAt) {
  if (!boundAt) return true;
  const now = new Date();
  const then = new Date(boundAt);
  const hoursPassed = (now - then) / (1000 * 60 * 60);
  return hoursPassed >= IP_EXPIRY_HOURS;
}

// === UUID SYSTEM ===
app.get('/register', (req, res) => {
  const newUUID = uuidv4();
  const uuids = loadJSON(VALID_UUIDS_FILE);
  uuids[newUUID] = true;
  saveJSON(VALID_UUIDS_FILE, uuids);
  res.json({ uuid: newUUID, message: '✅ UUID registered.' });
});

app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP)
    return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });

  const validUUIDs = loadJSON(VALID_UUIDS_FILE);
  if (!validUUIDs[uuid])
    return res.status(403).json({ valid: false, message: '❌ Invalid UUID.' });

  const sessions = loadJSON(SESSION_FILE);
  const data = sessions[uuid];

  if (!data || isExpired(data.boundAt)) {
    sessions[uuid] = { ip: clientIP, boundAt: new Date().toISOString() };
    saveJSON(SESSION_FILE, sessions);
    return res.json({ valid: true, message: '✅ UUID validated and IP locked.' });
  }

  if (data.ip === clientIP)
    return res.json({ valid: true, message: '✅ UUID verified.' });

  return res.status(401).json({ valid: false, message: '❌ UUID already in use by another IP.' });
});

app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const sessions = loadJSON(SESSION_FILE);
  const data = sessions[uuid];

  if (!data)
    return res.status(404).json({ unbound: false, message: '❌ UUID not in use.' });

  if (data.ip === clientIP || isExpired(data.boundAt)) {
    delete sessions[uuid];
    saveJSON(SESSION_FILE, sessions);
    return res.json({ unbound: true, message: '✅ UUID unbound. Session cleared.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ IP mismatch.' });
});

// === BYBIT V5 PRICE ===
app.get('/bybit-price', async (req, res) => {
  try {
    const url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${TRADE_SYMBOL}`;
    const { data } = await axios.get(url);
    const price = parseFloat(data?.result?.list?.[0]?.lastPrice);
    if (isNaN(price)) throw new Error('Invalid price from Bybit');
    res.json({ symbol: TRADE_SYMBOL, price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price', details: err.message });
  }
});

// === BYBIT V5 WALLET BALANCE ===
app.get('/wallet', async (req, res) => {
  try {
    const timestamp = Date.now();
    const recvWindow = 5000;
    const queryString = `apiKey=${BYBIT_API_KEY}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const sign = crypto.createHmac('sha256', BYBIT_API_SECRET).update(queryString).digest('hex');

    const url = `https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED&${queryString}&sign=${sign}`;
    const { data } = await axios.get(url, {
      headers: { 'X-BYBIT-API-KEY': BYBIT_API_KEY }
    });

    const coins = data?.result?.list?.[0]?.coin || [];
    const eth = parseFloat(coins.find(c => c.coin === 'ETH')?.availableToWithdraw || 0);
    const usdt = parseFloat(coins.find(c => c.coin === 'USDT')?.availableToWithdraw || 0);
    res.json({ eth, usdt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wallet', details: err.message });
  }
});

// === PLACE TRADE (Buy/Sell) ===
app.post('/trade', async (req, res) => {
  const { side, price } = req.body;
  if (!['Buy', 'Sell'].includes(side)) {
    return res.status(400).json({ error: 'Invalid side. Use "Buy" or "Sell".' });
  }

  try {
    const timestamp = Date.now();
    const recvWindow = 5000;
    const body = {
      category: 'linear',
      symbol: TRADE_SYMBOL,
      side,
      orderType: 'Limit',
      qty: TRADE_QTY.toString(),
      price: price.toString(),
      timeInForce: 'GoodTillCancel',
      apiKey: BYBIT_API_KEY,
      recvWindow,
      timestamp
    };

    const orderedKeys = Object.keys(body).sort();
    const query = orderedKeys.map(key => `${key}=${body[key]}`).join('&');
    const sign = crypto.createHmac('sha256', BYBIT_API_SECRET).update(query).digest('hex');

    const url = `https://api.bybit.com/v5/order/create`;
    const { data } = await axios.post(url, body, {
      headers: {
        'X-BYBIT-API-KEY': BYBIT_API_KEY,
        'X-BYBIT-SIGN': sign,
        'Content-Type': 'application/json'
      }
    });

    res.json({ success: true, result: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place trade', details: err.message });
  }
});

// === DEBUG / UPTIME / DEV ===
app.get('/dev-all', (req, res) => res.json(loadJSON(SESSION_FILE)));
app.get('/heartbeat', (req, res) => res.send('❤️ CROAK alive'));
app.get('/keep-alive', (req, res) => res.status(200).send('🟢 Croak server is alive!'));

// === START CROAK SERVER ===
app.listen(PORT, () => {
  info(`🚀 Unified Croak Gateway running on port ${PORT}`);
});

// === RUN AUTO TRADER ===
(async () => {
  try {
    if (!BYBIT_API_KEY || !BYBIT_API_SECRET)
      throw new Error('API Key & Secret are both required for private endpoints');
    await runAutoTrade();
    info('🧠 Auto-trade bot loaded successfully');
  } catch (err) {
    error('❌ Failed to start auto-trade bot:', err.message || err);
  }
})();
