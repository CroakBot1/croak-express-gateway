// == CROAK UUID GATEWAY BACKEND 🐸🚪 ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 🧠 In-memory UUID database
const uuidDB = {}; // format: { uuid: { buyer, createdAt, status } }

// ✅ Generate UUID endpoint
app.post('/generate-uuid', (req, res) => {
  const buyer = req.body.buyer || "unknown_user";
  const uuid = uuidv4();

  uuidDB[uuid] = {
    uuid,
    buyer,
    createdAt: new Date().toISOString(),
    status: "active"
  };

  console.log("🎯 UUID Generated:", uuid, "| Buyer:", buyer);
  res.json({ success: true, uuid });
});

// ✅ Verify UUID endpoint (optional)
app.post('/verify', (req, res) => {
  const { uuid } = req.body;
  const data = uuidDB[uuid];

  if (!data) return res.json({ valid: false, message: "UUID not found" });

  res.json({ valid: true, uuid, buyer: data.buyer, status: data.status });
});

app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway running on port ${PORT}`);
});
