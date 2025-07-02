const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apploverss3@gmail.com',
    pass: process.env.APP_PASS
  }
});

app.post('/save', async (req, res) => {
  const data = req.body;

  try {
    fs.writeFileSync('memory.json', JSON.stringify(data, null, 2));

    await transporter.sendMail({
      from: '"Croak Bot" <apploverss3@gmail.com>',
      to: 'apploverss3@gmail.com',
      subject: '🧠 Croak Bot Memory Backup',
      text: 'Attached is your memory file.',
      attachments: [
        {
          filename: 'memory.json',
          path: './memory.json'
        }
      ]
    });

    fs.unlinkSync('memory.json');
    res.json({ message: '✅ Memory saved, emailed, and deleted from server' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Failed to process memory save/email/delete' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
