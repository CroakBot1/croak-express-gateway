module.exports = {
  apps: [
    {
      name: "croak-bot",
      script: "auto-trade-runner.js",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
        DEFAULT_QTY: "0.05",             // <-- override kung wala sa .env
        TRADE_INTERVAL: "60000",         // 60 seconds
        // Add other fallback ENV variables below if needed:
        // BYBIT_API_KEY: "your_api_key",
        // BYBIT_API_SECRET: "your_api_secret"
      }
    }
  ]
}
