const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const EMAIL = 'apploverss3@gmail.com';
const APP_PASS = process.env.APP_PASS;

app.post('/save', async (req, res) => {
  try {
    const memory = req.body.memory;
    const timestamp = req.body.timestamp || new Date().toISOString();

    if (!memory) return res.status(400).send('No memory provided.');

    const content = JSON.stringify(memory, null, 2);
    const filename = `memory-${Date.now()}.json`;
    fs.writeFileSync(filename, content);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: APP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Croakbot Memory" <${EMAIL}>`,
      to: EMAIL,
      subject: `Memory Snapshot - ${timestamp}`,
      text: `Memory snapshot attached.`,
      attachments: [
        {
          filename,
          path: `./${filename}`,
        },
      ],
    });

    fs.unlinkSync(filename);
    console.log("✅ Memory saved, emailed, and deleted");

    res.send({ success: true });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err.message);
    res.status(500).send("Server error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
