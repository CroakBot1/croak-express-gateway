// uniswapExecutor.js
const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const UNISWAP_ROUTER = "0x327Df1E6de05895d2ab08513aaDD9313Fe505d86"; // Base Uniswap v2/v3 universal router

async function swapETHForToken(tokenAddress, amountInEth) {
  const router = new ethers.Contract(
    UNISWAP_ROUTER,
    ["function swapExactETHForTokens(uint, address[], address, uint) payable returns (uint[])"],
    wallet
  );

  const path = ["0x4200000000000000000000000000000000000006", tokenAddress]; // ETH → Token
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 mins

  const tx = await router.swapExactETHForTokens(
    0,
    path,
    wallet.address,
    deadline,
    {
      value: ethers.utils.parseEther(amountInEth),
      gasLimit: 1500000,
    }
  );

  return await tx.wait();
}

module.exports = swapETHForToken;

