const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, "latest.jpg"),
});
const upload = multer({ storage });

app.use(express.static("public"));

// Mobile camera uploader
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mobile.html"));
});

// Viewer screen
app.get("/view", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "viewer.html"));
});

// Handle image upload from camera
app.post("/upload", upload.single("frame"), (req, res) => {
  res.send("Frame received");
});

app.listen(PORT, () => {
  console.log(`CCTV backend running at: http://localhost:${PORT}`);
});
