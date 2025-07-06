const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const app = express();
app.use(express.json());

// Secret keys dapat naka .env or secure config
const BYBIT_API_KEY = process.env.BYBIT_API_KEY;
const BYBIT_SECRET = process.env.BYBIT_SECRET;

app.post('/place-order', async (req, res) => {
  try {
    const { symbol, side, qty } = req.body;
    const timestamp = Date.now().toString();
    
    const params = `api_key=${BYBIT_API_KEY}&symbol=${symbol}&side=${side}&qty=${qty}&timestamp=${timestamp}`;
    const signature = crypto.createHmac('sha256', BYBIT_SECRET).update(params).digest('hex');

    const headers = {
      'Content-Type': 'application/json',
      'X-BYBIT-API-KEY': BYBIT_API_KEY,
      'X-BYBIT-SIGNATURE': signature,
      'X-BYBIT-TIMESTAMP': timestamp
    };

    const response = await axios.post(
      'https://api.bybit.com/v5/order/create', 
      {
        symbol,
        side,
        qty,
        timestamp
      },
      { headers }
    );

    res.json(response.data);
  } catch (err) {
    console.error('❌ Order Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Order failed', details: err.message });
  }
});

app.listen(10000, () => console.log('🚀 Server running on port 10000'));
