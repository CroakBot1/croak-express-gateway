const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Store memory in a temporary JSON file
const memoryFile = 'memory.json';

app.post('/save-memory', (req, res) => {
  const memory = req.body.memory || {};
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
  res.send({ status: 'success', message: 'Memory saved' });
});

app.get('/load-memory', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
    res.send({ memory: data });
  } catch (err) {
    res.status(500).send({ error: 'Memory not found or corrupt.' });
  }
});

// Send memory file to Gmail every 5 minutes
setInterval(() => {
  if (!fs.existsSync(memoryFile)) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'apploverss3@gmail.com',
      pass: 'flnh tsyz yqwp apzz'
    }
  });

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
    if (error) return console.error('❌ Email failed:', error);
    console.log('📬 Memory email sent:', info.response);
  });
}, 5 * 60 * 1000); // every 5 mins

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ready on port ${PORT}`));
