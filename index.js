const nodemailer = require('nodemailer');

function sendEmail(subject, body) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'your-app-password'
    }
  });

  const mailOptions = {
    from: 'youremail@gmail.com',
    to: 'apploverss3@gmail.com',
    subject,
    text: body
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("❌ Email error:", err);
    else console.log("✅ Email sent:", info.response);
  });
}
