import { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useTheme } from "../context/ThemeContext";
import StatCard from "../components/StatCard";
import InsightCard from "../components/InsightCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  formatDuration,
  CATEGORY_COLORS,
  getCategoryBadgeClass,
  getEfficiencyRating,
} from "../utils/calculations";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, Area, AreaChart
} from "recharts";

const Dashboard = () => {
  const { sessions, stats, insights, loading } = useSession();
  const { isDark } = useTheme();

  // Chart data
  const categoryChartData = useMemo(() => {
    return Object.entries(stats.categoryBreakdown).map(([name, data]) => ({
      name,
      duration: data.totalDuration,
      roa: data.totalROA,
      sessions: data.count,
      avgEfficiency: data.avgEfficiency,
    }));
  }, [stats.categoryBreakdown]);

  const efficiencyTrendData = useMemo(() => {
    if (sessions.length === 0) return [];
    // Take last 10 sessions reversed
    return [...sessions].reverse().slice(-10).map((s, i) => ({
      name: s.activity?.substring(0, 12) || `Session ${i + 1}`,
      efficiency: s.efficiency,
      roa: s.roa,
    }));
  }, [sessions]);

  const pieData = useMemo(() => {
    return Object.entries(stats.categoryBreakdown).map(([name, data]) => ({
      name,
      value: data.totalDuration,
      color: CATEGORY_COLORS[name] || "#818cf8",
    }));
  }, [stats.categoryBreakdown]);

  const chartTextColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)";

  if (loading) return <LoadingSpinner />;

  if (sessions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <EmptyState
          icon="🎯"
          title="Start Tracking Your Attention"
          message="Log your first attention session to see ROA analytics, insights, and performance breakdowns."
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
          Attention Dashboard
        </h1>
        <p className="text-sm" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
          Your attention investment overview at a glance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard
          title="Total Attention Time"
          value={formatDuration(stats.totalDuration)}
          icon="⏱️"
          subtitle={`${stats.totalSessions} sessions`}
          color="#6366f1"
          delay={0}
        />
        <StatCard
          title="Total ROA"
          value={stats.totalROA.toLocaleString()}
          icon="📈"
          subtitle="Return on Attention"
          color="#10b981"
          delay={80}
        />
        <StatCard
          title="Avg Efficiency"
          value={`${stats.avgEfficiency}%`}
          icon="⚡"
          subtitle={getEfficiencyRating(stats.avgEfficiency).label}
          color="#f59e0b"
          trend={stats.avgEfficiency >= 60 ? "up" : "down"}
          delay={160}
        />
        <StatCard
          title="Avg Focus Level"
          value={`${stats.avgFocusLevel}/5`}
          icon="🧠"
          subtitle={`Outcome: ${stats.avgOutcomeScore}/5`}
          color="#8b5cf6"
          delay={240}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category ROA Bar Chart */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            📊 ROA by Category
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryChartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 12,
                    fontSize: 13,
                    color: isDark ? '#e2e8f0' : '#334155',
                  }}
                />
                <Bar dataKey="roa" radius={[8, 8, 0, 0]}>
                  {categoryChartData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#818cf8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution Pie */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            ⏰ Time Distribution
          </h3>
          <div className="chart-container flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                  formatter={(value) => [`${formatDuration(value)}`, "Time"]}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span style={{ color: chartTextColor, fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Efficiency Trend */}
      {efficiencyTrendData.length > 1 && (
        <div className="glass-card p-5 mb-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            📈 Efficiency Trend (Last 10 Sessions)
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={efficiencyTrendData}>
                <defs>
                  <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 11 }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#effGradient)"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: isDark ? '#1e293b' : '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Row: Top/Worst + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top & Worst Activities */}
        <div className="space-y-6">
          {/* Top 3 */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: '#34d399' }}>
              🏆 Top 3 Activities (Highest ROA)
            </h3>
            <div className="space-y-3">
              {stats.topActivities.map((s, i) => (
                <ActivityRow key={s.id || i} session={s} rank={i + 1} isDark={isDark} type="top" />
              ))}
            </div>
          </div>

          {/* Worst 3 */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: '#f87171' }}>
              ⚠️ Worst Performing Activities
            </h3>
            <div className="space-y-3">
              {stats.worstActivities.map((s, i) => (
                <ActivityRow key={s.id || i} session={s} rank={i + 1} isDark={isDark} type="worst" />
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: '#818cf8' }}>
            🧠 AI Insights
          </h3>
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <InsightCard key={i} insight={ins} delay={i * 100} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-center py-8"
              style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
              Log more sessions to unlock personalized insights.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ActivityRow = ({ session, rank, isDark, type }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl"
    style={{ background: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(241,245,249,0.6)' }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
      style={{
        background: type === "top"
          ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
        color: type === "top" ? '#34d399' : '#f87171',
      }}>
      #{rank}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold truncate mb-0"
        style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
        {session.activity}
      </p>
      <span className={`badge ${getCategoryBadgeClass(session.category)} text-xs`}
        style={{ marginTop: 2 }}>
        {session.category}
      </span>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-sm font-bold mb-0" style={{ color: type === "top" ? '#34d399' : '#f87171' }}>
        {session.roa?.toLocaleString()}
      </p>
      <p className="text-xs mb-0" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>ROA</p>
    </div>
  </div>
);

export default Dashboard;
