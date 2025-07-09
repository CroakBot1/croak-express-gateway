// == CROAK UUID GATEWAY 🐸🔐 ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

// Temporary in-memory storage (can replace with DB)
const uuidDB = {};

app.post('/generate-uuid', (req, res) => {
  const uuid = uuidv4();
  const buyer = req.body.buyer || "unknown";
  const source = req.body.source || "manual";

  uuidDB[uuid] = {
    uuid,
    buyer,
    createdAt: new Date().toISOString(),
    status: "active",
    source
  };

  console.log("🎯 New UUID registered:", uuidDB[uuid]);
  res.json({ success: true, uuid });
});

app.get('/uuids', (req, res) => {
  res.json(Object.values(uuidDB));
});

app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway running on http://localhost:${PORT}`);
});
