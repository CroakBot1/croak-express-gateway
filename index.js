// index.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// 💚 Base route – simple alive check
app.get('/', (req, res) => {
  res.send('🟢 CROAK BOT SERVER IS AWAKE & LISTENING 🐸');
});

// Optional: Add status route for cronjob ping check
app.get('/ping', (req, res) => {
  console.log('📡 Received ping from CRONJOB @', new Date().toISOString());
  res.status(200).send('✅ Ping received');
});

// Optional: Self-ping every 5 mins (in case no external pinger)
setInterval(() => {
  fetch('https://your-app-url.cyclic.app/ping')
    .then(() => console.log('🔁 Self-ping success'))
    .catch(() => console.log('❌ Self-ping failed'));
}, 5 * 60 * 1000); // 5 minutes

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CROAK SERVER RUNNING on PORT ${PORT}`);
});
