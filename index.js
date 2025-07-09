// === CROAK BOT BACKEND – GUARDIAN MODE V2 (HARDCODED LICENSE) 🛡️🐸 ===
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// === CONFIG ===
const HARDCODED_LICENSES = {
  "32239105688": { used: false, boundIP: null },
  "54893021785": { used: false, boundIP: null },
};

// === MIDDLEWARE ===
app.use(express.json());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '⚠️ Too many requests. Slow down.'
}));

// === LICENSE VALIDATION ===
app.post('/croak/validate', (req, res) => {
  const { licenseKey, clientIP } = req.body;
  const key = String(licenseKey);

  if (!key || !clientIP) {
    return res.status(400).json({ valid: false, message: 'Missing licenseKey or clientIP' });
  }

  const entry = HARDCODED_LICENSES[key];
  if (!entry) {
    return res.status(404).json({ valid: false, message: 'License not found' });
  }

  if (entry.used && entry.boundIP !== clientIP) {
    return res.status(403).json({ valid: false, message: 'License already used on another IP' });
  }

  if (!entry.used) {
    entry.used = true;
    entry.boundIP = clientIP;
  }

  res.json({
    valid: true,
    message: 'License validated',
    boundIP: entry.boundIP
  });
});

// === STATUS ===
app.get('/', (req, res) => {
  res.send('🟢 Croak Guardian Backend (Hardcoded License) is Online');
});

// === LAUNCH ===
app.listen(PORT, () => {
  console.log(`🟢 CROAK BACKEND ONLINE ON PORT ${PORT}`);
});
