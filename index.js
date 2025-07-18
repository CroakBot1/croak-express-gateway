const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/trade/buy', (req, res) => {
  console.log('BUY request received:', req.body);
  res.json({ status: 'BUY success', data: req.body });
});

app.post('/trade/sell', (req, res) => {
  console.log('SELL request received:', req.body);
  res.json({ status: 'SELL success', data: req.body });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
