const express = require('express');
const cors = require('cors');
const app = express();

let savedMemory = {};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Croak Gateway Live');
});

app.post('/save', (req, res) => {
  savedMemory = req.body;
  console.log("💾 Memory Saved:", savedMemory);
  res.json({ status: 'ok', message: 'Memory saved.', items: Object.keys(savedMemory).length });
});

app.get('/load', (req, res) => {
  console.log("📤 Memory Sent:", savedMemory);
  res.json(savedMemory);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Croak Gateway running on port ${PORT}`);
});
