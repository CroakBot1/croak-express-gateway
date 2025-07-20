const { ethers } = require('ethers');
require('dotenv').config();

const abi = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const router = new ethers.Contract(
  '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86', // Uniswap v2 router on Base
  abi,
  wallet
);

async function executeTrade(type = 'buy') {
  const amountIn = ethers.parseEther(process.env.AMOUNT);
  const path = type === 'buy'
    ? [process.env.TOKEN_IN, process.env.TOKEN_OUT]
    : [process.env.TOKEN_OUT, process.env.TOKEN_IN];

  const tx = await router.swapExactETHForTokens(
    0,
    path,
    process.env.WALLET_ADDRESS,
    Math.floor(Date.now() / 1000) + 60 * 10,
    { value: amountIn, gasLimit: 200000 }
  );

  console.log(`[${new Date().toISOString()}] Trade executed: ${type}`);
}

module.exports = { executeTrade };

// === backend-trader/log/trade.log ===
# auto-generated log file. Each line logs timestamp and price before trade decision.
