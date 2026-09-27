/**
 * Open-source rule-based sentiment analysis for student feedback & complaints
 * Evaluates sentiment polarity score: Positive, Neutral, Negative, Critical
 */

const CRITICAL_KEYWORDS = [
  'danger', 'hazard', 'emergency', 'unsafe', 'harassment', 'threat', 
  'broken wire', 'fire hazard', 'electric shock', 'corrupted', 'severe',
  'leakage', 'flooding', 'urgent', 'disaster', 'assault', 'violence', 'outage'
];

const NEGATIVE_KEYWORDS = [
  'bad', 'worst', 'poor', 'terrible', 'horrible', 'delay', 'dirty', 'unclean',
  'stale', 'cold', 'unacceptable', 'slow', 'fail', 'failed', 'broken', 'issue',
  'problem', 'complaint', 'frustrated', 'annoying', 'disappointed', 'unfair',
  'rude', 'lack', 'missing', 'damaged', 'overcrowded', 'noise', 'smell'
];

const POSITIVE_KEYWORDS = [
  'great', 'good', 'excellent', 'wonderful', 'amazing', 'helpful', 'thank',
  'thanks', 'appreciation', 'appreciate', 'improved', 'fantastic', 'best',
  'praise', 'awesome', 'polite', 'clean', 'efficient', 'smooth', 'love'
];

function analyzeSentiment(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  
  // Check for critical security/safety indicators
  let criticalMatches = 0;
  for (const word of CRITICAL_KEYWORDS) {
    if (text.includes(word)) criticalMatches++;
  }
  if (criticalMatches > 0) return 'Critical';

  // Tokenize & count matches
  const words = text.replace(/[^\w\s]/gi, '').split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of words) {
    if (POSITIVE_KEYWORDS.includes(word)) positiveScore++;
    if (NEGATIVE_KEYWORDS.includes(word)) negativeScore++;
  }

  if (negativeScore >= 3 || (negativeScore > positiveScore && negativeScore >= 2)) {
    return 'Negative';
  } else if (positiveScore > negativeScore) {
    return 'Positive';
  } else if (negativeScore > 0) {
    return 'Negative';
  }

  return 'Neutral';
}

module.exports = { analyzeSentiment };
