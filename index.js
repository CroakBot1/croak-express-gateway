const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MEMORY_PATH = path.join(__dirname, 'memory.json');

// === Email Sender Setup ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apploverss3@gmail.com',
    pass: 'logirdljgwttuorv'
  }
});

// === Save Memory Endpoint ===
app.post('/save', async (req, res) => {
  try {
    const { memory, timestamp } = req.body;
    if (!memory) return res.status(400).send('No memory data');

    const formatted = {
      savedAt: new Date().toISOString(),
      memory
    };

    // Save locally
    fs.writeFileSync(MEMORY_PATH, JSON.stringify(formatted, null, 2));

    // Send to email
    const mailOptions = {
      from: 'apploverss3@gmail.com',
      to: 'apploverss3@gmail.com',
      subject: `🧠 CroakBot Memory Snapshot - ${timestamp}`,
      text: JSON.stringify(formatted, null, 2)
    };

    await transporter.sendMail(mailOptions);

    // Auto delete after email
    fs.writeFileSync(MEMORY_PATH, '{}');

    console.log('✅ Memory saved and emailed!');
    res.send({ status: 'success', msg: 'Saved and emailed' });
  } catch (err) {
    console.error('❌ Error saving memory:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
