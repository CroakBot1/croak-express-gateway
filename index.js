const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Sample proxy route
app.get('/', (req, res) => {
  res.send('🟢 Croak Express Gateway is alive!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
