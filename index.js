const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const memoryFile = 'memory.json';

// ✅ Auto-create with sample memory if missing
if (!fs.existsSync(memoryFile)) {
  const defaultMemory = {
    croak_test: "testing123",
    wallet_address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    strategy_mode: "AI-61K-Hybrid",
    last_trade: "Buy 0.01 ETH",
    confidence_score: "87.3",
    bot_version: "v5.0-Legendary",
    last_update: new Date().toISOString()
  };
  fs.writeFileSync(memoryFile, JSON.stringify(defaultMemory, null, 2));
  console.log('📁 Created default memory.json');
}

// 🌐 Save memory from frontend
app.post('/save-memory', (req, res) => {
  const memory = req.body.memory || {};
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
  res.send({ status: 'success', message: 'Memory saved' });
});

// 🌐 Load memory to frontend
app.get('/load-memory', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
    res.send({ memory: data });
  } catch (err) {
    res.status(500).send({ error: 'Memory not found or corrupt.' });
  }
});

// 📩 Gmail setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apploverss3@gmail.com',
    pass: 'flnh tsyz yqwp apzz'
  }
});

// 🕒 Auto-send every 5 mins
setInterval(() => {
  if (!fs.existsSync(memoryFile)) return;

  const fileData = fs.readFileSync(memoryFile, 'utf8');
  if (!fileData || fileData.trim() === '{}' || fileData.trim() === '') {
    console.log('🚫 Skipping email: memory is empty.');
    return;
  }

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
    if (error) {
      console.error('❌ Failed to send email:', error);
      return;
    }
    console.log('📬 Email sent:', info.response);

    try {
      fs.unlinkSync(memoryFile);
      console.log('🧹 CroakBot memory file cleaned up!');
    } catch (err) {
      console.error('⚠️ Cleanup failed:', err);
    }
  });
}, 5 * 60 * 1000); // every 5 minutes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 CroakBot Memory Server running on port ${PORT}`));
