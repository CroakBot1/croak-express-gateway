// sentimentLayer.js

function analyze(marketData) {
  // Sample logic: return score from -1 (very bearish) to 1 (very bullish)
  if (!marketData || typeof marketData !== 'object') {
    return 0; // neutral fallback
  }

  const { price, volume, trend } = marketData;

  let score = 0;

  // Trend-based
  if (trend === 'up') score += 0.5;
  if (trend === 'down') score -= 0.5;

  // Volume-based
  if (volume > 100000) score += 0.2;

  // Price movement (example logic)
  if (price.changePct > 5) score += 0.3;
  else if (price.changePct < -5) score -= 0.3;

  return Math.max(-1, Math.min(1, score)); // clamp to -1 ~ 1
}

module.exports = {
  analyze
};
