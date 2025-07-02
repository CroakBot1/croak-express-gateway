// index.js (Full Fix Backend)
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

let lastMemory = null;

// Endpoint to save memory from frontend
app.post('/save', (req, res) => {
  const memory = req.body.memory;
  const timestamp = new Date().toISOString();
  if (!memory) return res.status(400).send('No memory provided');

  const json = JSON.stringify({ memory, timestamp }, null, 2);
  fs.writeFileSync('memory.json', json);
  lastMemory = json;

  console.log(`[SERVER] Memory saved at ${timestamp}`);

  // Email every save
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `Croak Bot Server <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `🧠 Hybrid 61k++ Memory Update` ,
    text: `Attached is the latest memory snapshot.`,
    attachments: [
      {
        filename: 'memory.json',
        content: json
      }
    ]
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Email error:', err);
    } else {
      console.log('📩 Email sent:', info.response);
    }
  });

  // Optional: auto-delete after 5 mins (in-memory only)
  setTimeout(() => {
    lastMemory = null;
    console.log('[SERVER] Memory auto-cleared after 5 minutes');
  }, 300000);

  res.send({ status: 'OK', saved: true });
});

// Optional endpoint to check memory
app.get('/memory', (req, res) => {
  if (!lastMemory) return res.status(404).send('No memory available');
  res.type('json').send(lastMemory);
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
