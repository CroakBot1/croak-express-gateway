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

// In-memory storage (replace with DB later)
const users = {}; // { username: password }
const activeConnections = new Map(); // { username: ws }

// 🔐 Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  if (users[username]) {
    return res.status(409).json({ success: false, message: "Username taken" });
  }
  users[username] = password;
  res.json({ success: true, message: "User registered" });
});

// 🔐 Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.json({ success: true, username });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// 🔍 Search users
app.get("/users", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const result = Object.keys(users).filter((u) =>
    u.toLowerCase().includes(q.toLowerCase())
  );
  res.json(result);
});

// 🔁 Keep-alive endpoint
app.get("/ping", (req, res) => {
  res.send("🟢 Server is alive");
});

// 🧠 WebSocket real-time messaging
wss.on("connection", (ws) => {
  let username = null;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // Initial authentication after connecting
      if (data.type === "auth") {
        username = data.username;
        activeConnections.set(username, ws);
        console.log(`✅ ${username} connected`);

        // Notify other users
        broadcast(`${username} joined the chat`, username);
      }

      // Handle chat messages
      if (data.type === "chat" && username) {
        const message = {
          from: username,
          to: data.to || "everyone",
          text: data.text,
          time: new Date().toISOString()
        };

        if (data.to && data.to !== "everyone") {
          // Send private message
          const targetWS = activeConnections.get(data.to);
          if (targetWS && targetWS.readyState === WebSocket.OPEN) {
            targetWS.send(JSON.stringify({ type: "chat", ...message }));
          }
        } else {
          // Broadcast to everyone
          broadcast(JSON.stringify({ type: "chat", ...message }), username);
        }
      }
    } catch (err) {
      console.error("❌ Invalid message", err.message);
    }
  });

  ws.on("close", () => {
    if (username) {
      console.log(`❌ ${username} disconnected`);
      activeConnections.delete(username);
      broadcast(`${username} left the chat`, username);
    }
  });
});

// Helper function to broadcast to all users except sender
function broadcast(message, sender) {
  for (let [user, client] of activeConnections.entries()) {
    if (user !== sender && client.readyState === WebSocket.OPEN) {
      client.send(typeof message === "string" ? message : JSON.stringify(message));
    }
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
