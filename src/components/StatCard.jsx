import { useTheme } from "../context/ThemeContext";

const StatCard = ({ title, value, subtitle, icon, trend, color = "#6366f1", delay = 0 }) => {
  const { isDark } = useTheme();

  return (
    <div
      className="glass-card p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-lg"
            style={{
              background: trend === "up" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              color: trend === "up" ? "#34d399" : "#f87171",
            }}
          >
            {trend === "up" ? "↑" : "↓"} {typeof trend === "string" ? "" : `${Math.abs(trend)}%`}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
        {value}
      </p>
      <p className="text-sm font-medium mb-0" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
        {title}
      </p>
      {subtitle && (
        <p className="text-xs mt-1 mb-0" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
