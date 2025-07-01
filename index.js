const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const memoryFile = 'memory.json';

// ✅ Ensure memory file exists on boot
if (!fs.existsSync(memoryFile)) {
  fs.writeFileSync(memoryFile, JSON.stringify({}, null, 2));
  console.log('🆕 Initialized empty memory file');
}

// 🌐 Save Memory Endpoint
app.post('/save-memory', (req, res) => {
  const memory = req.body.memory || {};
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
  res.send({ status: 'success', message: 'Memory saved' });
});

// 🌐 Load Memory Endpoint
app.get('/load-memory', (req, res) => {
  if (!fs.existsSync(memoryFile)) {
    return res.status(404).send({ error: 'Memory file not found.' });
  }

  try {
    const data = JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
    res.send({ memory: data });
  } catch (err) {
    console.error('❌ Failed to read memory:', err);
    res.status(500).send({ error: 'Failed to load memory.' });
  }
});

// 📩 Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apploverss3@gmail.com',
    pass: 'flnh tsyz yqwp apzz' // App Password
  }
});

// ⏰ Email + Cleanup Every 5 Minutes
setInterval(() => {
  if (!fs.existsSync(memoryFile)) return;

  const now = new Date();
  const subject = `📩 CroakBot Memory @ ${now.toLocaleString()}`;
  const filename = `croakbot-${now.toISOString().replace(/[:.]/g, '-')}.txt`;

  const mailOptions = {
    from: 'CroakBot <apploverss3@gmail.com>',
    to: 'apploverss3@gmail.com',
    subject,
    text: 'Attached is your latest CroakBot memory snapshot.',
    attachments: [{ filename, path: `./${memoryFile}` }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.error('❌ Email failed:', error);
    console.log('📬 Email sent:', info.response);

    // ✅ Delete file after sending
    try {
      fs.unlinkSync(memoryFile);
      console.log('🧹 Cleaned up memory.json!');
    } catch (err) {
      console.error('⚠️ Failed cleanup:', err);
    }
  });
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 CroakBot Server running on port ${PORT}`));
