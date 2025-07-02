const express = require('express');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MEMORY_PATH = path.join(__dirname, 'memory.json');

// Init empty memory if not exists
if (!fs.existsSync(MEMORY_PATH)) {
  fs.writeFileSync(MEMORY_PATH, JSON.stringify({}));
}

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apploverss3@gmail.com',
    pass: process.env.APP_PASS || 'your-gmail-app-password',
  },
});

// Save memory and email
app.post('/save', async (req, res) => {
  try {
    const memory = req.body;
    fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2));

    // Email memory snapshot
    await transporter.sendMail({
      from: '"Croak Bot" <apploverss3@gmail.com>',
      to: 'apploverss3@gmail.com',
      subject: '🧠 Croak Bot Memory Snapshot',
      text: 'Attached is the current memory.json',
      attachments: [{ filename: 'memory.json', path: MEMORY_PATH }],
    });

    console.log('✅ Memory saved and emailed.');
    res.json({ status: 'success' });
  } catch (err) {
    console.error('❌ Error saving memory:', err.message);
    res.status(500).json({ error: 'Failed to save memory' });
  }
});

// Load memory
app.get('/load', (req, res) => {
  try {
    const data = fs.readFileSync(MEMORY_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load memory' });
  }
});

// Clear memory every 5 minutes
setInterval(() => {
  try {
    fs.writeFileSync(MEMORY_PATH, JSON.stringify({}));
    console.log('🧹 Memory cleared automatically');
  } catch (err) {
    console.error('❌ Auto-clear failed:', err.message);
  }
}, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
