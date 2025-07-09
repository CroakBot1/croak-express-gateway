// == Croak UUID Generator API 🐸🔐 ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 10000;
app.use(cors());
app.use(express.json());

// Temporary in-memory database (use real DB in prod)
const db = {};

app.post('/generate-uuid', (req, res) => {
  const uuid = uuidv4();
  const buyer = req.body.buyer || "unknown";
  const source = req.body.source || "manual";

  db[uuid] = {
    uuid,
    buyer,
    createdAt: new Date().toISOString(),
    status: "active",
    source
  };

  console.log("🎯 New UUID registered:", db[uuid]);
  res.json({ success: true, uuid });
});

app.get('/uuids', (req, res) => {
  res.json(Object.values(db)); // optional admin preview
});

app.listen(PORT, () => {
  console.log(`🟢 UUID Generator API running on http://localhost:${PORT}`);
});
