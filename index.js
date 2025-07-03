const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const EMAIL_USER = 'apploverss3@gmail.com';
const EMAIL_PASS = 'logirdljgwttuorv';

// ✅ EMAIL Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// ✅ EXISTING: MEMORY SAVE & EMAIL CYCLE
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

// ✅ NEW: LICENSE KEY VALIDATION ENDPOINT
const LICENSE_KEYS = [
  "32239105688", "29672507957", "12550915154", "96678374801"
  // ➕ add more here...
];

app.post('/validate-key', (req, res) => {
  const { license } = req.body;
  if (LICENSE_KEYS.includes(license)) {
    res.json({ valid: true });
  } else {
    res.status(403).json({ valid: false, message: 'Invalid license key' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CroakBot backend live on port ${PORT}`);
});
