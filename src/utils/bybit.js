const logger = require('../logger');

let mockBalance = 1000;
let mockState = {
  entryPrice: null,
  side: null,
  qty: null,
  changePct: 0
};

// GET MOCK BALANCE
function getBalance() {
  logger.info('[💰 MOCK CAPITAL] Returning default 1000 USDT');
  return mockBalance;
}

// GET MOCK MEMORY STATE
function getMemoryState() {
  logger.info('[🧠 MOCK MEMORY STATE] Returning default memory state');
  return mockState;
}

// SET MOCK MEMORY STATE
function setMemoryState(state) {
  mockState = { ...mockState, ...state };
  logger.info('[💾 MOCK STATE UPDATED]', mockState);
}

// SIMULATED MARKET CHANGE
function simulateMarketChange(newChange) {
  mockState.changePct = newChange;
  logger.info('[📊 MOCK MARKET CHANGE] %:', newChange);
}

// CLEAR STATE
function resetState() {
  mockState = {
    entryPrice: null,
    side: null,
    qty: null,
    changePct: 0
  };
  logger.info('[🧹 MOCK STATE RESET]');
}

module.exports = {
  getBalance,
  getMemoryState,
  setMemoryState,
  simulateMarketChange,
  resetState
};
