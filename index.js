// index.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Simple memory file for temp storage
const TEMP_FILE = 'memory-temp.json';

// Email config (use Gmail SMTP or other provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apploverss3@gmail.com',     // ✅ Your Gmail
    pass: 'YOUR_APP_PASSWORD_HERE'     // 🔐 Use Gmail App Password
  }
});

// POST /save endpoint
app.post('/save', async (req, res) => {
  const memoryData = req.body;

  if (!memoryData || Object.keys(memoryData).length === 0) {
    return res.status(400).json({ error: 'No memory data received.' });
  }

  // Save to temp file (optional)
  fs.writeFileSync(TEMP_FILE, JSON.stringify(memoryData, null, 2));

  // Prepare and send email
  try {
    await transporter.sendMail({
      from: 'Croak Bot <apploverss3@gmail.com>',
      to: 'apploverss3@gmail.com',
      subject: '🧠 Croak Bot Memory Dump',
      text: JSON.stringify(memoryData, null, 2),
    });

    // Delete temp memory after sending
    fs.unlinkSync(TEMP_FILE);

    res.json({ status: 'Memory sent and deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email.', details: err.message });
  }
});

// Fallback for 404
app.use((req, res) => {
  res.status(404).send('Croak Gateway active, but route not found.');
});

app.listen(PORT, () => {
  console.log(`🚀 Croak Express Gateway V2 running on port ${PORT}`);
});
