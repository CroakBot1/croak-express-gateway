// src/vetoLayer.js

const vetoLayer = {
  shouldVeto: ({ priceData, memory, trapDetected }) => {
    // ✅ Basic veto logic based on memory and trap detection

    // Veto if trap detected
    if (trapDetected) {
      console.log("🚫 VETO: Trap detected.");
      return true;
    }

    // Veto if same trade was just executed
    if (memory.lastTrade && memory.lastTrade.time) {
      const now = Date.now();
      const timeSinceLast = now - memory.lastTrade.time;
      if (timeSinceLast < 10000) { // 10 seconds cooldown
        console.log("🚫 VETO: Too soon since last trade.");
        return true;
      }
    }

    // Veto if sudden price spike (simple 5% jump/drop logic)
    const change = Math.abs(priceData.current - priceData.previous) / priceData.previous;
    if (change > 0.05) {
      console.log("🚫 VETO: Sudden price movement (>5%).");
      return true;
    }

    // ✅ Passed all veto checks
    return false;
  }
};

module.exports = vetoLayer;

