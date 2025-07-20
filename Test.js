// test.js
const { LinearClient } = require('bybit-api');

// 🟢 DIRECTLY HARD-CODE YOUR KEYS HERE (if not using .env)
const BYBIT_API_KEY = 'YOUR_API_KEY_HERE';
const BYBIT_API_SECRET = 'YOUR_API_SECRET_HERE';

// 🔧 Create client (use false for MAINNET, true for TESTNET)
const client = new LinearClient(
  BYBIT_API_KEY,
  BYBIT_API_SECRET,
  false
);

// ✅ Example function to check wallet balance
async function checkBalance() {
  try {
    const response = await client.getWalletBalance('USDT');
    console.log('🪙 Wallet Balance (USDT):', response);
  } catch (err) {
    console.error('❌ Error getting wallet balance:', err.message || err);
  }
}

// 🔁 Run the test
checkBalance();
