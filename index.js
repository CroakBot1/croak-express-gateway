const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const memoryFile = 'memory.json';

// 🌐 API Endpoint: Save Memory
app.post('/save-memory', (req, res) => {
  const memory = req.body.memory || {};
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
  res.send({ status: 'success', message: 'Memory saved' });
});

// 🌐 API Endpoint: Load Memory
app.get('/load-memory', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
    res.send({ memory: data });
  } catch (err) {
    res.status(500).send({ error: 'Memory not found or corrupt.' });
  }
});

// 📩 EMAIL CONFIG (Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apploverss3@gmail.com',
    pass: 'flnh tsyz yqwp apzz'
  }
});

// ⏰ AUTO EMAIL + CLEANUP every 5 minutes
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
    attachments: [
      {
        filename,
        path: `./${memoryFile}`
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Failed to send email:', error);
      return;
    }

    console.log('📬 Email sent:', info.response);

    // ✅ CLEANUP: Delete the memory file after sending
    try {
      fs.unlinkSync(memoryFile);
      console.log('🧹 CroakBot memory file cleaned up!');
    } catch (err) {
      console.error('⚠️ Cleanup failed:', err);
    }
  });
}, 5 * 60 * 1000); // 5 minutes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 CroakBot Memory Server running on port ${PORT}`));
