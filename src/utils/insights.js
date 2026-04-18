/**
 * Insights Engine — Rule-based analytical insights
 */
import { enrichSession, CATEGORY_COLORS } from "./calculations";

export const generateInsights = (sessions) => {
  if (!sessions || sessions.length === 0) return [];

  const insights = [];
  const enriched = sessions.map(enrichSession);

  // 1. Low Focus Warning
  const lowFocusSessions = enriched.filter((s) => s.focusLevel < 3);
  const lowFocusPct = Math.round((lowFocusSessions.length / enriched.length) * 100);
  if (lowFocusPct > 40) {
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: "Low Focus Pattern Detected",
      message: `${lowFocusPct}% of your sessions have a focus level below 3. Consider reducing distractions or scheduling focus blocks during your peak hours.`,
      severity: "high",
    });
  } else if (lowFocusPct > 20) {
    insights.push({
      type: "info",
      icon: "💡",
      title: "Focus Room for Improvement",
      message: `${lowFocusPct}% of sessions scored below average focus. Try techniques like Pomodoro or environment optimization.`,
      severity: "medium",
    });
  }

  // 2. Attention Leak — High duration but low outcome
  const leaks = enriched.filter((s) => s.duration >= 60 && s.outcomeScore <= 2);
  if (leaks.length > 0) {
    const leakActivities = [...new Set(leaks.map((s) => s.activity))].join(", ");
    insights.push({
      type: "danger",
      icon: "🔴",
      title: "Attention Leak Detected",
      message: `You're spending significant time on "${leakActivities}" with poor outcomes. These are draining your attention budget without returns.`,
      severity: "high",
    });
  }

  // 3. High ROA activities — suggest investing more
  const highROA = enriched.filter((s) => s.efficiency >= 75);
  if (highROA.length > 0) {
    const bestActivities = [...new Set(highROA.map((s) => s.activity))].slice(0, 3).join(", ");
    insights.push({
      type: "success",
      icon: "🚀",
      title: "High ROA Activities Found",
      message: `"${bestActivities}" are delivering strong returns on your attention. Consider allocating more time to these.`,
      severity: "low",
    });
  }

  // 4. Category productivity analysis
  const categoryStats = {};
  enriched.forEach((s) => {
    if (!categoryStats[s.category]) {
      categoryStats[s.category] = { totalROA: 0, totalDuration: 0, count: 0 };
    }
    categoryStats[s.category].totalROA += s.roa;
    categoryStats[s.category].totalDuration += s.duration;
    categoryStats[s.category].count += 1;
  });

  let bestCategory = null;
  let bestCatAvgROA = 0;
  let worstCategory = null;
  let worstCatAvgROA = Infinity;

  Object.entries(categoryStats).forEach(([cat, stats]) => {
    const avgROA = stats.totalROA / stats.count;
    if (avgROA > bestCatAvgROA) {
      bestCatAvgROA = avgROA;
      bestCategory = cat;
    }
    if (avgROA < worstCatAvgROA) {
      worstCatAvgROA = avgROA;
      worstCategory = cat;
    }
  });

  if (bestCategory) {
    insights.push({
      type: "success",
      icon: "🏆",
      title: "Most Productive Category",
      message: `You're most productive in "${bestCategory}" with an average ROA of ${Math.round(bestCatAvgROA)}. This is where your attention investment pays off most.`,
      severity: "low",
    });
  }

  if (worstCategory && worstCategory !== bestCategory) {
    insights.push({
      type: "info",
      icon: "📉",
      title: "Lowest Performing Category",
      message: `"${worstCategory}" has the lowest average ROA (${Math.round(worstCatAvgROA)}). Evaluate if the time invested here aligns with your goals.`,
      severity: "medium",
    });
  }

  // 5. Session consistency
  if (enriched.length >= 7) {
    const avgDuration = enriched.reduce((s, e) => s + e.duration, 0) / enriched.length;
    const variance = enriched.reduce((s, e) => s + Math.pow(e.duration - avgDuration, 2), 0) / enriched.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / avgDuration) * 100;

    if (cv > 60) {
      insights.push({
        type: "info",
        icon: "📊",
        title: "Inconsistent Session Lengths",
        message: `Your session durations vary a lot (CV: ${Math.round(cv)}%). Consistent session lengths often correlate with better focus and outcomes.`,
        severity: "medium",
      });
    }
  }

  // 6. Quick wins detection
  const quickWins = enriched.filter((s) => s.duration <= 30 && s.efficiency >= 70);
  if (quickWins.length >= 2) {
    insights.push({
      type: "success",
      icon: "⚡",
      title: "Quick Win Patterns",
      message: `You have ${quickWins.length} short sessions (<30min) with high efficiency. These quick wins are valuable—keep leveraging them!`,
      severity: "low",
    });
  }

  // 7. Overwork detection
  const longSessions = enriched.filter((s) => s.duration > 120);
  const longLowFocus = longSessions.filter((s) => s.focusLevel <= 2);
  if (longLowFocus.length > 0) {
    insights.push({
      type: "warning",
      icon: "😴",
      title: "Diminishing Returns on Long Sessions",
      message: `You have ${longLowFocus.length} sessions over 2 hours with low focus. Consider breaking these into shorter, more focused blocks.`,
      severity: "high",
    });
  }

  return insights;
};

// Generate weekly summary
export const generateWeeklySummary = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      totalTime: 0,
      avgEfficiency: 0,
      topCategory: "N/A",
      sessionsCount: 0,
      trend: "neutral",
      dailyBreakdown: [],
    };
  }

  const enriched = sessions.map(enrichSession);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter to this week
  const thisWeek = enriched.filter((s) => {
    const date = s.date ? new Date(s.date) : (s.createdAt?.toDate ? s.createdAt.toDate() : new Date());
    return date >= weekAgo;
  });

  if (thisWeek.length === 0) {
    return {
      totalTime: 0,
      avgEfficiency: 0,
      topCategory: "N/A",
      sessionsCount: 0,
      trend: "neutral",
      dailyBreakdown: [],
    };
  }

  const totalTime = thisWeek.reduce((s, e) => s + e.duration, 0);
  const avgEfficiency = Math.round(thisWeek.reduce((s, e) => s + e.efficiency, 0) / thisWeek.length);

  // Top category
  const catCounts = {};
  thisWeek.forEach((s) => {
    catCounts[s.category] = (catCounts[s.category] || 0) + 1;
  });
  const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Daily breakdown for chart
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dailyBreakdown = days.map((day, idx) => {
    const daySessions = thisWeek.filter((s) => {
      const d = s.date ? new Date(s.date) : (s.createdAt?.toDate ? s.createdAt.toDate() : new Date());
      return d.getDay() === idx;
    });
    return {
      day,
      duration: daySessions.reduce((s, e) => s + e.duration, 0),
      sessions: daySessions.length,
      avgEfficiency: daySessions.length > 0
        ? Math.round(daySessions.reduce((s, e) => s + e.efficiency, 0) / daySessions.length)
        : 0,
    };
  });

  return {
    totalTime,
    avgEfficiency,
    topCategory,
    sessionsCount: thisWeek.length,
    trend: avgEfficiency >= 60 ? "up" : avgEfficiency >= 40 ? "neutral" : "down",
    dailyBreakdown,
  };
};
