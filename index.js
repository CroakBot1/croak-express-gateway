// === BACKEND: Croak License Validator 🛡️ ===
// Save as: backend/index.js

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = 3000;

// Load license keys from JSON
let licenses = require('./license.json');

app.use(cors());
app.use(helmet());
app.use(express.json());

// ✅ Validate License Endpoint
app.post('/croak/validate', (req, res) => {
  const { licenseKey } = req.body;

  if (!licenseKey || typeof licenseKey !== 'string') {
    return res.status(400).json({ error: '❌ Invalid request format.' });
  }

  if (licenses[licenseKey] && !licenses[licenseKey].used) {
    // Optional: mark as used or bind IP
    licenses[licenseKey].used = true;
    fs.writeFileSync('./license.json', JSON.stringify(licenses, null, 2));

    return res.json({ success: true, message: '✅ License valid' });
  } else {
    return res.status(403).json({ error: '❌ License invalid or already used.' });
  }
});

app.get('/', (req, res) => {
  res.send('🟢 Croak License Backend Online');
});

app.listen(PORT, () => console.log(`🟢 Backend running at http://localhost:${PORT}`));
