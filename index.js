const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const EMAIL_USER = 'apploverss3@gmail.com';
const EMAIL_PASS = 'logirdljgwttuorv';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

app.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().toISOString();

    const content = `
🧠 C.R.O.A.K. Memory Snapshot
⏰ Time: ${timestamp}

📝 MEMORY:
${JSON.stringify(data.memory, null, 2)}
    `;

    // ✉️ Send memory as a .txt file attachment
    await transporter.sendMail({
      from: `"CroakBot Memory" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: `CroakBot Memory Dump - ${timestamp}`,
      text: 'Attached is the latest CroakBot memory snapshot.',
      attachments: [
        {
          filename: `croak-memory-${timestamp}.txt`,
          content: content
        }
      ]
    });

    console.log('✅ Email with .txt attachment sent');
    res.json({ status: 'success', message: 'Email with attachment sent' });
  } catch (e) {
    console.error('❌ Error saving memory:', e.message);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CroakBot backend live on port ${PORT}`);
});

Packege.json
{
  "name": "croakbot-backend",
  "version": "1.0.0",
  "description": "Croak Bot Express Backend",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "nodemailer": "^6.9.8"
  }
}
