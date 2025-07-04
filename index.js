app.post('/fetch-balance', async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;
    const account = new RESTClient(apiKey, apiSecret);
    const result = await account.getWalletBalance({ accountType: 'UNIFIED' });
    res.json(result);
  } catch (err) {
    console.error('Balance Fetch Error:', err);
    res.status(500).json({ error: 'Balance fetch failed' });
  }
});

app.post('/fetch-positions', async (req, res) => {
  try {
    const { apiKey, apiSecret, symbol } = req.body;
    const account = new RESTClient(apiKey, apiSecret);
    const result = await account.getPositionInfo({ category: 'linear', symbol });
    res.json(result);
  } catch (err) {
    console.error('Position Fetch Error:', err);
    res.status(500).json({ error: 'Position fetch failed' });
  }
});
