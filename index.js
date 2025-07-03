const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*', // or specify 'https://www.bybit.com' for tighter security
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Trade endpoint
app.post('/execute-trade', (req, res) => {
  const { side, qty } = req.body;
  console.log(`Received trade: ${side} ${qty}`);
  res.json({ status: 'success', side, qty });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
