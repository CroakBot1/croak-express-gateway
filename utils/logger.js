const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/decisions.log');

// Ensure the logs folder exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logToFile = (msg) => {
  fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ${msg}\n`);
};

module.exports = {
  trackDecision: (decision) => {
    const logMessage = `Decision: ${JSON.stringify(decision)}`;
    console.log(`\x1b[36m[📈 CROAK LOG]\x1b[0m ${logMessage}`);
    logToFile(logMessage);
  },

  trackError: (error) => {
    const logMessage = `ERROR: ${error}`;
    console.error(`\x1b[31m[❌ CROAK ERROR]\x1b[0m ${logMessage}`);
    logToFile(logMessage);
  },

  trackTrade: (msg) => {
    const logMessage = `TRADE: ${msg}`;
    console.log(`\x1b[32m[💰 TRADE]\x1b[0m ${logMessage}`);
    logToFile(logMessage);
  },

  trackInfo: (msg) => {
    const logMessage = `INFO: ${msg}`;
    console.log(`\x1b[34m[ℹ️ INFO]\x1b[0m ${logMessage}`);
    logToFile(logMessage);
  }
};
