import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Bot is running 24/7!');
});

app.get('/ping', (req, res) => {
  res.send('✅ Ping success!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is alive on port ${PORT}`);
});
