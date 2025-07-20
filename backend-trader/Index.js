// index.js
require('dotenv').config();
const runLoop = require('./core/strategyEngine');

setInterval(runLoop, 8000); // Every 8 seconds → real-time
console.log("🚀 CROAK Quantum Backend running 24/7...");

