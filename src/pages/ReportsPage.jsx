import { useMemo } from "react";
import { useSession } from "../context/SessionContext";
import { useTheme } from "../context/ThemeContext";
import InsightCard from "../components/InsightCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  formatDuration,
  CATEGORY_COLORS,
  enrichSession,
} from "../utils/calculations";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  CartesianGrid, LineChart, Line, Legend, Area, AreaChart
} from "recharts";
import { Link } from "react-router-dom";

const ReportsPage = () => {
  const { sessions, insights, weeklySummary, stats, loading } = useSession();
  const { isDark } = useTheme();

  const chartTextColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)";

  // Category performance radar data
  const radarData = useMemo(() => {
    return Object.entries(stats.categoryBreakdown).map(([name, data]) => ({
      category: name,
      efficiency: data.avgEfficiency,
      sessions: Math.min(data.count * 20, 100), // Normalized
      time: Math.min(data.totalDuration / 10, 100), // Normalized
    }));
  }, [stats.categoryBreakdown]);

  // High time, low return detection
  const attentionLeaks = useMemo(() => {
    if (sessions.length === 0) return [];
    const enriched = sessions.map(enrichSession);
    return enriched
      .filter((s) => s.duration >= 45 && s.efficiency < 40)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);
  }, [sessions]);

  // Best performing sessions
  const bestSessions = useMemo(() => {
    if (sessions.length === 0) return [];
    const enriched = sessions.map(enrichSession);
    return enriched
      .filter((s) => s.efficiency >= 70)
      .sort((a, b) => b.roa - a.roa)
      .slice(0, 5);
  }, [sessions]);

  if (loading) return <LoadingSpinner />;

  if (sessions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <EmptyState
          icon="📊"
          title="No Data for Reports"
          message="Start logging attention sessions to generate weekly reports and insights."
          action={
            <Link to="/add-session" className="btn-primary no-underline inline-block">
              + Log Your First Session
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1"
          style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
          Reports & Insights
        </h1>
        <p className="text-sm" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
          Deep analysis of your attention investment patterns
        </p>
      </div>

      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <SummaryCard
          icon="📅"
          label="This Week"
          value={formatDuration(weeklySummary.totalTime)}
          sub={`${weeklySummary.sessionsCount} sessions`}
          isDark={isDark}
          delay={0}
        />
        <SummaryCard
          icon="⚡"
          label="Avg Efficiency"
          value={`${weeklySummary.avgEfficiency}%`}
          sub={weeklySummary.trend === "up" ? "↑ Trending up" : weeklySummary.trend === "down" ? "↓ Needs work" : "→ Stable"}
          isDark={isDark}
          delay={80}
          valueColor={weeklySummary.trend === "up" ? "#34d399" : weeklySummary.trend === "down" ? "#f87171" : "#818cf8"}
        />
        <SummaryCard
          icon="🏆"
          label="Top Category"
          value={weeklySummary.topCategory}
          sub="Most invested"
          isDark={isDark}
          delay={160}
        />
        <SummaryCard
          icon="📈"
          label="Total ROA"
          value={stats.totalROA.toLocaleString()}
          sub="Lifetime score"
          isDark={isDark}
          delay={240}
          valueColor="#10b981"
        />
      </div>

      {/* Weekly Activity Bar Chart */}
      {weeklySummary.dailyBreakdown && weeklySummary.dailyBreakdown.some(d => d.duration > 0) && (
        <div className="glass-card p-5 mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            📅 Weekly Activity Overview
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklySummary.dailyBreakdown} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                  formatter={(value, name) => {
                    if (name === "duration") return [`${formatDuration(value)}`, "Time Spent"];
                    if (name === "avgEfficiency") return [`${value}%`, "Avg Efficiency"];
                    return [value, name];
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: chartTextColor, fontSize: 12 }}>
                      {value === "duration" ? "Time (m)" : "Efficiency (%)"}
                    </span>
                  )}
                />
                <Bar dataKey="duration" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avgEfficiency" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Two Column: Radar + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Radar */}
        {radarData.length > 0 && (
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              🎯 Category Performance Radar
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="category" tick={{ fill: chartTextColor, fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: chartTextColor, fontSize: 10 }}
                  />
                  <Radar
                    name="Efficiency"
                    dataKey="efficiency"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Time Investment"
                    dataKey="time"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: chartTextColor, fontSize: 12 }}>{value}</span>
                    )}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#1e293b' : '#ffffff',
                      border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: 12,
                      fontSize: 13,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Smart Insights */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: '#818cf8' }}>
            🧠 Smart Insights
          </h3>
          {insights.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {insights.map((ins, i) => (
                <InsightCard key={i} insight={ins} delay={i * 80} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">💡</span>
              <p className="text-sm" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                Log more sessions to unlock personalized insights and recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Attention Leaks & Best Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attention Leaks */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: '#f87171' }}>
            🔴 Attention Leaks
          </h3>
          <p className="text-xs mb-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
            High time investment with low efficiency (below 40%)
          </p>
          {attentionLeaks.length > 0 ? (
            <div className="space-y-2">
              {attentionLeaks.map((s, i) => (
                <div key={s.id || i} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: isDark ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.03)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate mb-0"
                      style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
                      {s.activity}
                    </p>
                    <p className="text-xs mb-0" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                      {formatDuration(s.duration)} • Focus: {s.focusLevel}/5
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold mb-0" style={{ color: '#f87171' }}>
                      {s.efficiency}%
                    </p>
                    <p className="text-xs mb-0" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>eff.</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl">✅</span>
              <p className="text-sm mt-2" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                No significant attention leaks detected. Great job!
              </p>
            </div>
          )}
        </div>

        {/* Best Performers */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: '#34d399' }}>
            🚀 Best Performers
          </h3>
          <p className="text-xs mb-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
            Sessions with 70%+ efficiency — invest more here
          </p>
          {bestSessions.length > 0 ? (
            <div className="space-y-2">
              {bestSessions.map((s, i) => (
                <div key={s.id || i} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: isDark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.03)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate mb-0"
                      style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
                      {s.activity}
                    </p>
                    <p className="text-xs mb-0" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                      {formatDuration(s.duration)} • ROA: {s.roa.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold mb-0" style={{ color: '#34d399' }}>
                      {s.efficiency}%
                    </p>
                    <p className="text-xs mb-0" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>eff.</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl">📈</span>
              <p className="text-sm mt-2" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                Keep improving! Aim for 70%+ efficiency to appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, sub, isDark, delay = 0, valueColor }) => (
  <div
    className="glass-card p-5 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-xl mb-2">{icon}</div>
    <p className="text-xs font-semibold uppercase tracking-wider mb-1"
      style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
      {label}
    </p>
    <p className="text-xl font-bold mb-0"
      style={{ color: valueColor || (isDark ? '#f1f5f9' : '#1e293b') }}>
      {value}
    </p>
    <p className="text-xs mb-0 mt-1" style={{ color: isDark ? '#475569' : '#94a3b8' }}>
      {sub}
    </p>
  </div>
);

export default ReportsPage;
