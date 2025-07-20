// src/utils/bybit.js

export function formatPrice(price, decimals = 2) {
  return parseFloat(price).toFixed(decimals);
}

export function calculateTP(entryPrice, side, percent = 1.5) {
  const ratio = percent / 100;
  return side === 'Long'
    ? entryPrice * (1 + ratio)
    : entryPrice * (1 - ratio);
}

export function calculateSL(entryPrice, side, percent = 0.8) {
  const ratio = percent / 100;
  return side === 'Long'
    ? entryPrice * (1 - ratio)
    : entryPrice * (1 + ratio);
}

export function calculateSize(capital, price, leverage = 10) {
  if (!capital || !price) return 0;
  const positionValue = capital * leverage;
  return positionValue / price;
}

export function isVolatile(changePct, threshold = 1.0) {
  return Math.abs(changePct) >= threshold;
}

export function classifyTrend(changePct) {
  if (changePct >= 2) return '🚀 STRONG BULL';
  if (changePct >= 0.5) return '📈 Mild Bull';
  if (changePct <= -2) return '💥 STRONG BEAR';
  if (changePct <= -0.5) return '📉 Mild Bear';
  return '⚖️ Sideways';
}

export function scoreConfidence(memoryScore) {
  if (memoryScore >= 90) return '🔵 Ultra High';
  if (memoryScore >= 75) return '🟢 High';
  if (memoryScore >= 50) return '🟡 Moderate';
  return '🔴 Low';
}

export function adjustTPBasedOnVolatility(entryPrice, side, changePct) {
  let tpPercent = 1.2;

  if (Math.abs(changePct) >= 2.5) {
    tpPercent = 2.5;
  } else if (Math.abs(changePct) >= 1.5) {
    tpPercent = 2.0;
  } else if (Math.abs(changePct) >= 0.8) {
    tpPercent = 1.5;
  }

  return calculateTP(entryPrice, side, tpPercent);
}
