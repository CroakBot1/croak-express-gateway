// index.js

console.log("✅ CROAK BOT 24/7 is now running...");

// Example loop for autotrade every X seconds
setInterval(() => {
  const now = new Date().toLocaleString();
  console.log(`[${now}] 🟢 Auto-check triggered (insert trade logic here)`);

  // Call your trade logic here
  // e.g., checkPriceAndTrade();

}, 10 * 1000); // every 10 seconds
