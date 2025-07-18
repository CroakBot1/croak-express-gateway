const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const AUTH_TOKEN = "croakSuperSecure123";

// In-memory wallet state
let wallet = {
  CROAK: 100000000,
  PHP: 10000
};

// Core Auth Checker
function checkAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn("No auth header sent.");
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return false;
  }
  if (auth !== `Bearer ${AUTH_TOKEN}`) {
    console.warn("Invalid token:", auth);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return false;
  }
  return true;
}

// GET WALLET (Protected)
app.get('/wallet', (req, res) => {
  if (!checkAuth(req, res)) return;
  try {
    res.json(wallet);
  } catch (e) {
    console.error('Wallet fetch error:', e);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

// BUY CROAK
app.post('/buy', (req, res) => {
  if (!checkAuth(req, res)) return;
  const amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid buy amount" });
  }
  const totalCost = amount * 0.001;
  if (wallet.PHP >= totalCost) {
    wallet.PHP -= totalCost;
    wallet.CROAK += amount;
    res.json({ message: "Bought CROAK", wallet });
  } else {
    res.status(400).json({ error: "Not enough PHP" });
  }
});

// SELL CROAK
app.post('/sell', (req, res) => {
  if (!checkAuth(req, res)) return;
  const amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid sell amount" });
  }
  if (wallet.CROAK >= amount) {
    wallet.CROAK -= amount;
    wallet.PHP += amount * 0.001;
    res.json({ message: "Sold CROAK", wallet });
  } else {
    res.status(400).json({ error: "Not enough CROAK" });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('CROAK SERVER ACTIVE');
});

app.listen(PORT, () => {
  console.log(`CROAK SERVER LIVE ON PORT ${PORT}`);
});
