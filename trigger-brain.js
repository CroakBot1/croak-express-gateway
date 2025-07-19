// routes/trigger-brain.js
const express = require('express');
const router = express.Router();
const { runBrainLogic } = require('../brain');

router.post('/trigger-brain', async (req, res) => {
  try {
    const result = await runBrainLogic(); // 61k brain logic
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
