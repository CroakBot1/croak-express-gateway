require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Croak Express Gateway is alive!");
});

// Optional health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
