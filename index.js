require('dotenv').config();
const express = require('express');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

const PORT = process.env.PORT || 10000;
const LICENSE_FILE = './licensekey.json';

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { valid: false, message: "❌ Too many requests. Try again later." }
});
app.use(limiter);

// Endpoint for license validation
app.post('/croak/validate', (req, res) => {
  const { licenseKey, clientIP } = req.body;
  if (!licenseKey || !clientIP) {
    return res.json({ valid: false, message: "Missing license or IP." });
  }

  fs.readFile(LICENSE_FILE, 'utf8', (err, data) => {
    if (err) return res.json({ valid: false, message: "License storage error." });

    let licenses;
    try {
      licenses = JSON.parse(data);
    } catch {
      return res.json({ valid: false, message: "License data corrupted." });
    }

    const entry = licenses[licenseKey];
    if (!entry) {
      return res.json({ valid: false, message: "License key not found." });
    }

    if (entry.used && entry.boundIP !== clientIP) {
      return res.json({ valid: false, message: "License already used on another IP." });
    }

    entry.used = true;
    entry.boundIP = clientIP;

    fs.writeFile(LICENSE_FILE, JSON.stringify(licenses, null, 2), err => {
      if (err) return res.json({ valid: false, message: "Failed to update license." });

      return res.json({ valid: true, message: "License valid.", boundIP: clientIP });
    });
  });
});

app.get('/', (req, res) => {
  res.send('🧠 Croak License Gateway is alive!');
});

app.listen(PORT, () => {
  console.log(`🟢 Croak Gateway running on port ${PORT}`);
});
