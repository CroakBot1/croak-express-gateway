// == CROAK GATEWAY FINAL V3 — Unified Express Server ==
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const axios = require('axios');
const crypto = require('crypto'); // For wallet signing

const app = express();
const PORT = process.env.PORT || 3000;

// === Setup ===
app.use(cors());
app.use(express.json());

// === Config ===
const SESSION_FILE = 'uuids.json';
const VALID_UUIDS_FILE = 'valid-uuids.json';
const IP_EXPIRY_HOURS = 24;

// === BYBIT KEYS (replace with real ones) ===
const BYBIT_API_KEY = 'YOUR_API_KEY_HERE';
const BYBIT_API_SECRET = 'YOUR_API_SECRET_HERE';

// === Utilities ===
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

// === TRADE ROUTES (Simulation) ===
app.post('/trade/buy', (req, res) => {
  console.log('🟢 BUY request received:', req.body);
  res.json({ status: 'BUY success', data: req.body });
});

app.post('/trade/sell', (req, res) => {
  console.log('🔴 SELL request received:', req.body);
  res.json({ status: 'SELL success', data: req.body });
});

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

// === LIVE PRICE FETCH (ETHUSDT) ===
app.get('/bybit-price', async (req, res) => {
  try {
    const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear&symbol=ETHUSDT');
    const data = await response.json();
    const price = parseFloat(data?.result?.list?.[0]?.lastPrice);

    if (isNaN(price)) {
      return res.status(500).json({ error: 'Invalid price from Bybit' });
    }

    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price', details: err.message });
  }
});

// === WALLET BALANCE CHECK (BYBIT v5 Unified Account) ===
app.get('/wallet', async (req, res) => {
  try {
    const timestamp = Date.now();
    const recvWindow = 5000;

    const queryString = `apiKey=${BYBIT_API_KEY}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const sign = crypto.createHmac('sha256', BYBIT_API_SECRET).update(queryString).digest('hex');

    const url = `https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED&${queryString}&sign=${sign}`;

    const response = await axios.get(url, {
      headers: {
        'X-BYBIT-API-KEY': BYBIT_API_KEY
      }
    });

    const coins = response.data?.result?.list?.[0]?.coin || [];

    const eth = parseFloat(coins.find(c => c.coin === 'ETH')?.availableToWithdraw || 0);
    const usdt = parseFloat(coins.find(c => c.coin === 'USDT')?.availableToWithdraw || 0);

    res.json({ eth, usdt });
  } catch (err) {
    console.error('[WALLET ERROR]', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch wallet', details: err.message });
  }
});

// === HEARTBEAT ===
app.get('/heartbeat', (req, res) => {
  console.log(`[HEARTBEAT] Ping at ${new Date().toISOString()}`);
  res.send('❤️ CROAK alive and listening');
});

// === KEEP ALIVE ===
app.get('/keep-alive', (req, res) => {
  console.log(`[KEEP-ALIVE] Server pinged at ${new Date().toISOString()}`);
  res.status(200).send('🟢 Croak server is alive!');
});

// === DEV DEBUG ROUTE (TEMP) ===
app.get('/dev-all', (req, res) => {
  res.json(loadJSON(SESSION_FILE));
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Unified Croak Gateway running on port ${PORT}`);
});
