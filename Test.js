// test.js
const { LinearClient } = require('bybit-api');

// Hardcoded API credentials (test purpose only)
const API_KEY = 'fwYKsTQ84XIyRhnG4g';
const API_SECRET = 'dMBJSCa0GyZWhPBIz8qzEquUlMcxqRXLFHcT';

const client = new LinearClient({
  key: API_KEY,
  secret: API_SECRET,
  testnet: false, // true if you're using testnet
});

async function testConnection() {
  try {
    const result = await client.getWalletBalance({ coin: 'USDT' });
    console.log('✅ Connected. Wallet Balance:', result);
  } catch (error) {
    console.error('❌ Error:', error.message || error);
  }
}

testConnection();
