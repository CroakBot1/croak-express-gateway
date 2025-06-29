app.get('/btcprice', async (req, res) => {
  try {
    const response = await axios.get('https://api.bybit.com/v2/public/tickers?symbol=BTCUSDT');
    const price = response.data.result[0].last_price;
    res.json({ symbol: 'BTCUSDT', price });
  } catch (error) {
    console.error('Error fetching BTC price:', error.message);
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
});
