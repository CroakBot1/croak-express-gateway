// src/bybit.js

function getLivePrice(symbol = 'ETHUSDT') {
  console.log(`[📈 MOCK LIVE PRICE] Symbol: ${symbol}`);
  return Promise.resolve(2950); // mock price
}

function getCapital() {
  console.log(`[💰 MOCK CAPITAL] Returning default 1000 USDT`);
  return Promise.resolve(1000); // mock capital
}

function getMemoryState() {
  console.log(`[🧠 MOCK MEMORY] Returning empty memory state`);
  return Promise.resolve({});
}

function placeOrder(orderDetails) {
  console.log(`[🛒 MOCK ORDER] Order Placed:`, orderDetails);
  return Promise.resolve({ success: true });
}

function cancelAllOrders() {
  console.log(`[🧹 MOCK CANCEL] All orders cancelled`);
  return Promise.resolve({ success: true });
}

function getPNL(entryPrice, currentPrice, qty, side) {
  console.log(`[📉 MOCK PNL] Entry: ${entryPrice}, Current: ${currentPrice}, Qty: ${qty}, Side: ${side}`);
  return Promise.resolve((currentPrice - entryPrice) * qty * (side === 'Buy' ? 1 : -1));
}

module.exports = {
  getLivePrice,
  getCapital,
  getMemoryState,
  placeOrder,
  cancelAllOrders,
  getPNL
};
