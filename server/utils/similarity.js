/**
 * Common Issue & Duplicate Detection Engine
 * Uses text similarity & category clustering to identify duplicate or related student submissions.
 */

function tokenize(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)
  );
}

function calculateJaccardSimilarity(text1, text2) {
  const setA = tokenize(text1);
  const setB = tokenize(text2);
  
  if (setA.size === 0 || setB.size === 0) return 0;
  
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

function groupDuplicateIssues(submissions) {
  const clusters = [];
  const visited = new Set();

  for (let i = 0; i < submissions.length; i++) {
    if (visited.has(submissions[i]._id || submissions[i].id)) continue;

    const current = submissions[i];
    const currentId = current._id || current.id;
    const currentText = `${current.title} ${current.description}`;
    const related = [current];

    for (let j = i + 1; j < submissions.length; j++) {
      const other = submissions[j];
      const otherId = other._id || other.id;
      if (visited.has(otherId)) continue;

      // Primary criteria: same category OR high text similarity
      const otherText = `${other.title} ${other.description}`;
      const simScore = calculateJaccardSimilarity(currentText, otherText);

      const sameCategory = current.category === other.category;
      
      if ((sameCategory && simScore >= 0.25) || simScore >= 0.35) {
        related.push(other);
        visited.add(otherId);
      }
    }

    if (related.length > 1) {
      clusters.push({
        issueTitle: current.title,
        category: current.category,
        count: related.length,
        submissions: related,
        sampleTrackingIds: related.slice(0, 4).map(s => s.trackingId),
        highestPriority: related.some(r => r.priority === 'High') ? 'High' : (related.some(r => r.priority === 'Medium') ? 'Medium' : 'Low')
      });
    }
  }

  return clusters.sort((a, b) => b.count - a.count);
}

module.exports = { calculateJaccardSimilarity, groupDuplicateIssues };
