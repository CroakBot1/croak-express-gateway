// src/memoryCore.js

const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "../Memory.json");

let memory = {
  lastTrade: null,
  vetoHistory: [],
  brainScore: 0,
};

function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const data = fs.readFileSync(MEMORY_FILE, "utf8");
      memory = JSON.parse(data);
      console.log("🧠 Memory loaded.");
    }
  } catch (err) {
    console.error("❌ Failed to load memory:", err.message);
  }
}

function saveMemory() {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
    console.log("💾 Memory saved.");
  } catch (err) {
    console.error("❌ Failed to save memory:", err.message);
  }
}

function updateLastTrade(trade) {
  memory.lastTrade = {
    time: Date.now(),
    ...trade
  };
  saveMemory();
}

function addVeto(reason) {
  memory.vetoHistory.push({ reason, time: Date.now() });
  saveMemory();
}

function setBrainScore(score) {
  memory.brainScore = score;
  saveMemory();
}

function getMemory() {
  return memory;
}

module.exports = {
  loadMemory,
  saveMemory,
  updateLastTrade,
  addVeto,
  setBrainScore,
  getMemory
};

