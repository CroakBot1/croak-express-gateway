const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

// In-memory users: { username: password }
const users = {};
const sockets = new Map(); // { username: WebSocket }

// ✅ Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  if (users[username]) {
    return res.status(409).json({ success: false, message: "Username taken" });
  }
  users[username] = password;
  console.log(`✅ Registered: ${username}`);
  return res.json({ success: true });
});

// ✅ Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    console.log(`🔐 Logged in: ${username}`);
    return res.json({ success: true, username });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// 🔍 Search users
app.get("/users", (req, res) => {
  const q = req.query.q || "";
  const found = Object.keys(users).filter(u => u.includes(q));
  res.json(found);
});

// 🟢 Keep-alive endpoint (for cronjob pings)
app.get("/ping", (req, res) => {
  res.send("🟢 Server alive");
});

// 🔁 WebSocket Chat
wss.on("connection", (ws) => {
  let currentUser = null;

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw);

      if (data.type === "auth") {
        currentUser = data.username;
        sockets.set(currentUser, ws);
        console.log(`📡 ${currentUser} connected`);
        return;
      }

      if (data.type === "chat" && currentUser) {
        const payload = {
          from: currentUser,
          to: data.to,
          text: data.text,
          type: "chat",
        };

        if (data.to === "everyone") {
          for (let [user, client] of sockets.entries()) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(payload));
            }
          }
        } else {
          const target = sockets.get(data.to);
          if (target && target.readyState === WebSocket.OPEN) {
            target.send(JSON.stringify(payload));
          }
        }
      }
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  });

  ws.on("close", () => {
    if (currentUser) {
      sockets.delete(currentUser);
      console.log(`🔌 ${currentUser} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
