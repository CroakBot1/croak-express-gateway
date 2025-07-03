const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express(); // ✅ Declare Express app before using it

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// 🌐 Health Check
app.get('/', (req, res) => {
  res.send('✅ CroakBot Backend is Live!');
});

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

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

    console.log('✅ Email sent successfully!');
    res.json({ status: 'success', message: 'Memory sent via email.' });
  } catch (e) {
    console.error('❌ Error:', e.message);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CroakBot backend running on port ${PORT}`);
});
