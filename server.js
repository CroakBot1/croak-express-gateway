import express from 'express';
import { exec } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic root route for uptime checks
app.get('/', (req, res) => {
  res.send('✅ Bot is running 24/7!');
});

// Ping route for uptime cron jobs (like UptimeRobot)
app.get('/ping', (req, res) => {
  res.send('✅ Ping success!');
});

// Optional: Trigger a health check or command (like restarting the bot)
app.get('/restart-bot', (req, res) => {
  exec('node bot.mjs', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return res.status(500).send(`❌ Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      return res.status(500).send(`⚠️ Stderr: ${stderr}`);
    }
    console.log(`✅ Bot restarted:\n${stdout}`);
    res.send('✅ Bot restarted!');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ping Server running on http://localhost:${PORT}`);
});
