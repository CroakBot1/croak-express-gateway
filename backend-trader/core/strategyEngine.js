let lastPrice = null;

function shouldBuy(price) {
  if (!lastPrice) {
    lastPrice = price;
    return false;
  }
  const result = price < lastPrice * 0.995; // 0.5% drop
  lastPrice = price;
  return result;
}

function shouldSell(price) {
  return price > lastPrice * 1.01; // 1% gain
}

module.exports = { shouldBuy, shouldSell };
