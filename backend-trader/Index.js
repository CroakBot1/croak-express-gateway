const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log("✅ CROAK BOT 24/7 is now running...");

// Endpoint just to prove it's alive
app.get('/', (req, res) => {
  res.send("🐸 CROAK BOT LIVE");
});

// Example trading loop
setInterval(() => {
  const now = new Date().toLocaleString();
  console.log(`[${now}] 🟢 Auto-check triggered (insert trade logic here)`);
  // Example logic: checkPriceAndTrade();
}, 10 * 1000); // every 10 seconds

app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});
