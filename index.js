import express from 'express';
import { WebSocket } from 'ws';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const SYMBOL = 'ETHUSDT';

let lastPrice = null;

app.use(express.static('public')); // serve frontend files from /public folder

app.get('/api/price', (req, res) => {
  res.json({ price: lastPrice });
});

// Start Bybit WebSocket connection
const bybitWs = new WebSocket('wss://stream.bybit.com/v5/public/linear');

bybitWs.on('open', () => {
  console.log('✅ WebSocket connected');
  const subscribeMessage = {
    op: 'subscribe',
    args: [`tickers.${SYMBOL}`]
  };
  bybitWs.send(JSON.stringify(subscribeMessage));
});

bybitWs.on('message', (data) => {
  try {
    const msg = JSON.parse(data);
    const ticker = msg.data;

    if (ticker && ticker.lastPrice) {
      lastPrice = parseFloat(ticker.lastPrice);
      io.emit('priceUpdate', { price: lastPrice });
      console.log('🔁 Price:', lastPrice);
    }
  } catch (err) {
    console.error('❌ Parse Error:', err.message);
  }
});

bybitWs.on('error', (err) => {
  console.error('❌ WebSocket error:', err.message);
});

io.on('connection', (socket) => {
  console.log('📡 Client connected');
  if (lastPrice) {
    socket.emit('priceUpdate', { price: lastPrice });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
