/**
 * Attention Scoring Utilities
 * Core calculation engine for the Attention Investment Tracker
 */

// Attention Score = duration × focusLevel
export const calcAttentionScore = (duration, focusLevel) => {
  return duration * focusLevel;
};

// ROA (Return on Attention) = attentionScore × outcomeScore
export const calcROA = (duration, focusLevel, outcomeScore) => {
  const attentionScore = calcAttentionScore(duration, focusLevel);
  return attentionScore * outcomeScore;
};

// Max possible ROA for a session = duration × 5 × 5
export const calcMaxROA = (duration) => {
  return duration * 5 * 5;
};

// Efficiency % = (actual ROA / max possible ROA) × 100
export const calcEfficiency = (duration, focusLevel, outcomeScore) => {
  const actual = calcROA(duration, focusLevel, outcomeScore);
  const max = calcMaxROA(duration);
  if (max === 0) return 0;
  return Math.round((actual / max) * 100);
};

// Enrich a session object with computed scores
export const enrichSession = (session) => {
  const { duration, focusLevel, outcomeScore } = session;
  return {
    ...session,
    attentionScore: calcAttentionScore(duration, focusLevel),
    roa: calcROA(duration, focusLevel, outcomeScore),
    maxROA: calcMaxROA(duration),
    efficiency: calcEfficiency(duration, focusLevel, outcomeScore),
  };
};

// Aggregate stats for a collection of sessions
export const calcAggregateStats = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      totalAttentionScore: 0,
      totalROA: 0,
      avgEfficiency: 0,
      avgFocusLevel: 0,
      avgOutcomeScore: 0,
      topActivities: [],
      worstActivities: [],
      categoryBreakdown: {},
    };
  }

  const enriched = sessions.map(enrichSession);
  const totalSessions = enriched.length;
  const totalDuration = enriched.reduce((s, e) => s + e.duration, 0);
  const totalAttentionScore = enriched.reduce((s, e) => s + e.attentionScore, 0);
  const totalROA = enriched.reduce((s, e) => s + e.roa, 0);
  const avgEfficiency = Math.round(enriched.reduce((s, e) => s + e.efficiency, 0) / totalSessions);
  const avgFocusLevel = +(enriched.reduce((s, e) => s + e.focusLevel, 0) / totalSessions).toFixed(1);
  const avgOutcomeScore = +(enriched.reduce((s, e) => s + e.outcomeScore, 0) / totalSessions).toFixed(1);

  // Sort by ROA descending
  const sorted = [...enriched].sort((a, b) => b.roa - a.roa);
  const topActivities = sorted.slice(0, 3);
  const worstActivities = sorted.slice(-3).reverse();

  // Category breakdown
  const categoryBreakdown = {};
  enriched.forEach((s) => {
    if (!categoryBreakdown[s.category]) {
      categoryBreakdown[s.category] = {
        totalDuration: 0,
        totalROA: 0,
        count: 0,
        totalEfficiency: 0,
      };
    }
    categoryBreakdown[s.category].totalDuration += s.duration;
    categoryBreakdown[s.category].totalROA += s.roa;
    categoryBreakdown[s.category].count += 1;
    categoryBreakdown[s.category].totalEfficiency += s.efficiency;
  });

  // Compute average efficiency per category
  Object.keys(categoryBreakdown).forEach((cat) => {
    categoryBreakdown[cat].avgEfficiency = Math.round(
      categoryBreakdown[cat].totalEfficiency / categoryBreakdown[cat].count
    );
  });

  return {
    totalSessions,
    totalDuration,
    totalAttentionScore,
    totalROA,
    avgEfficiency,
    avgFocusLevel,
    avgOutcomeScore,
    topActivities,
    worstActivities,
    categoryBreakdown,
  };
};

// Categories
export const CATEGORIES = ["Learning", "Work", "Entertainment", "Health"];

// Category colors for charts
export const CATEGORY_COLORS = {
  Learning: "#818cf8",
  Work: "#34d399",
  Entertainment: "#fbbf24",
  Health: "#f472b6",
};

// Get badge class for category
export const getCategoryBadgeClass = (category) => {
  const map = {
    Learning: "badge-learning",
    Work: "badge-work",
    Entertainment: "badge-entertainment",
    Health: "badge-health",
  };
  return map[category] || "badge-learning";
};

// Format minutes to human readable
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// Focus level label
export const getFocusLabel = (level) => {
  const labels = { 1: "Very Low", 2: "Low", 3: "Moderate", 4: "High", 5: "Deep Focus" };
  return labels[level] || "Unknown";
};

// Outcome label
export const getOutcomeLabel = (score) => {
  const labels = { 1: "Poor", 2: "Below Average", 3: "Average", 4: "Good", 5: "Excellent" };
  return labels[score] || "Unknown";
};

// Efficiency rating
export const getEfficiencyRating = (efficiency) => {
  if (efficiency >= 80) return { label: "Excellent", color: "#34d399" };
  if (efficiency >= 60) return { label: "Good", color: "#818cf8" };
  if (efficiency >= 40) return { label: "Average", color: "#fbbf24" };
  if (efficiency >= 20) return { label: "Low", color: "#f97316" };
  return { label: "Poor", color: "#ef4444" };
};
