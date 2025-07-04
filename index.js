const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// === Replace with your actual Bybit Testnet API key and secret ===
const API_KEY = 'your-bybit-testnet-api-key';
const API_SECRET = 'your-bybit-testnet-api-secret';
const BYBIT_API = 'https://api-testnet.bybit.com';

const headers = {
  'X-BYBIT-API-KEY': API_KEY,
  'Content-Type': 'application/json',
};

// Root Check
app.get('/', (req, res) => {
  res.send('🐸 Croak Express Gateway is Alive!');
});

// === Fetch Balance ===
app.get('/fetch-balance', async (req, res) => {
  try {
    const result = await axios.get(`${BYBIT_API}/v5/account/wallet-balance?accountType=UNIFIED`, { headers });
    const usdtBalance = result.data?.result?.list?.[0]?.coin?.find(c => c.coin === 'USDT')?.availableToWithdraw;
    res.json({ usdt: parseFloat(usdtBalance || 0) });
  } catch (e) {
    console.error('Balance Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// === Fetch Open Positions ===
app.get('/fetch-positions', async (req, res) => {
  try {
    const result = await axios.get(`${BYBIT_API}/v5/position/list?category=linear`, { headers });
    const positions = result.data?.result?.list?.filter(pos => parseFloat(pos.size) > 0) || [];
    res.json(positions);
  } catch (e) {
    console.error('Position Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// === Place Order ===
app.post('/place-order', async (req, res) => {
  const { side, qty, tp, sl } = req.body;

  try {
    const result = await axios.post(`${BYBIT_API}/v5/order/create`, {
      category: 'linear',
      symbol: 'ETHUSDT',
      side,
      orderType: 'Market',
      qty,
      timeInForce: 'GoodTillCancel',
      takeProfit: tp,
      stopLoss: sl,
    }, { headers });

    if (result.data.retCode === 0) {
      res.json({ success: true, message: 'Order placed successfully' });
    } else {
      res.status(400).json({ success: false, error: result.data.retMsg });
    }
  } catch (e) {
    console.error('Order Error:', e.response?.data || e.message);
    res.status(500).json({ success: false, error: 'Order failed' });
  }
});

app.listen(port, () => {
  console.log(`✅ Croak Bot Backend running on port ${port}`);
});
