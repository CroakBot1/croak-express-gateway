// == CROAK UUID GATEWAY 🧠🐸 ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const uuidStore = []; // ← Store of valid UUIDs

// === 🆕 Generate UUID ===
app.post('/generate-uuid', (req, res) => {
  const newUUID = uuidv4();
  uuidStore.push(newUUID);
  console.log("✅ New UUID Generated:", newUUID);
  res.json({ uuid: newUUID });
});

// === ✅ Validate UUID ===
app.post('/validate-uuid', (req, res) => {
  const { uuid } = req.body;
  const isValid = uuidStore.includes(uuid);
  res.json({ valid: isValid });
});

// === 🏃 Start Server ===
app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway running on port ${PORT}`);
});
