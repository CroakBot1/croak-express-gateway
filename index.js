require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 10000;
const LICENSE_FILE = './licensekey.json';

// 🛡️ Middleware
app.use(cors()); // ✅ Enable CORS for all origins
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { valid: false, message: "❌ Too many requests. Try again later." }
});
app.use(limiter);

// 🔑 License validation endpoint
app.post('/croak/validate', (req, res) => {
  const { licenseKey, clientIP } = req.body;

  if (!licenseKey || !clientIP) {
    return res.json({ valid: false, message: "Missing license or IP." });
  }

  fs.readFile(LICENSE_FILE, 'utf8', (err, data) => {
    if (err) return res.json({ valid: false, message: "License file read error." });

    let licenses;
    try {
      licenses = JSON.parse(data);
    } catch {
      return res.json({ valid: false, message: "License file corrupted." });
    }

    const entry = licenses[licenseKey];
    if (!entry) {
      return res.json({ valid: false, message: "License not found." });
    }

    if (entry.used && entry.boundIP !== clientIP) {
      return res.json({ valid: false, message: "Already used on another IP." });
    }

    entry.used = true;
    entry.boundIP = clientIP;

    fs.writeFile(LICENSE_FILE, JSON.stringify(licenses, null, 2), err => {
      if (err) return res.json({ valid: false, message: "Failed to update license." });

      return res.json({ valid: true, message: "License OK", boundIP: clientIP });
    });
  });
});

// 🧠 Basic status check
app.get('/', (req, res) => {
  res.send('🧠 Croak Gateway is alive!');
});

app.listen(PORT, () => {
  console.log(`🟢 Croak Gateway running on port ${PORT}`);
});
