// index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { RestClientV5 } = require('bybit-api'); // ✅ Correct constructor

const app = express();
const port = process.env.PORT || 3000;

const client = new RestClientV5({               // ✅ Instantiate properly
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Croak Gateway Alive 🐸');
});

app.post('/execute-trade', async (req, res) => {
  try {
    const result = await client.submitOrder(req.body); // Example call
    res.json({ success: true, result });
  } catch (err) {
    console.error('Trade Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
