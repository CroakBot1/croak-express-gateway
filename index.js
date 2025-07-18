// 🛒 TRADE BUY (SIMULATION)
app.post('/trade/buy', (req, res) => {
  const { symbol, amount, price } = req.body;

  if (!symbol || !amount || !price) {
    return res.status(400).json({ success: false, error: '❌ Missing trade parameters.' });
  }

  console.log(`[BUY REQUEST] 📥 Symbol: ${symbol}, Amount: ${amount}, Price: ${price}`);
  res.json({
    success: true,
    message: '✅ Simulated BUY trade accepted.',
    symbol,
    amount,
    price
  });
});

// 💸 TRADE SELL (SIMULATION)
app.post('/trade/sell', (req, res) => {
  const { symbol, amount, price } = req.body;

  if (!symbol || !amount || !price) {
    return res.status(400).json({ success: false, error: '❌ Missing trade parameters.' });
  }

  console.log(`[SELL REQUEST] 📤 Symbol: ${symbol}, Amount: ${amount}, Price: ${price}`);
  res.json({
    success: true,
    message: '✅ Simulated SELL trade accepted.',
    symbol,
    amount,
    price
  });
});
