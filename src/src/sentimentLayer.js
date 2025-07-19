// sentimentLayer.js – Simple Sentiment Scanner Layer

module.exports = function sentimentLayer(priceHistory) {
    const changes = [];

    for (let i = 1; i < priceHistory.length; i++) {
        const diff = priceHistory[i] - priceHistory[i - 1];
        changes.push(diff);
    }

    const positive = changes.filter(c => c > 0).length;
    const negative = changes.filter(c => c < 0).length;

    const score = (positive / (positive + negative + 1)) * 100;

    if (score > 65) {
        return { sentiment: 'BULLISH', score };
    } else if (score < 35) {
        return { sentiment: 'BEARISH', score };
    } else {
        return { sentiment: 'NEUTRAL', score };
    }
};
