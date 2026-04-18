import { useTheme } from "../context/ThemeContext";

const InsightCard = ({ insight, delay = 0 }) => {
  const { isDark } = useTheme();

  const bgMap = {
    warning: isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.06)",
    danger: isDark ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.06)",
    success: isDark ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.06)",
    info: isDark ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.06)",
  };

  const borderMap = {
    warning: "rgba(245, 158, 11, 0.25)",
    danger: "rgba(239, 68, 68, 0.25)",
    success: "rgba(16, 185, 129, 0.25)",
    info: "rgba(99, 102, 241, 0.25)",
  };

  const titleColorMap = {
    warning: "#fbbf24",
    danger: "#f87171",
    success: "#34d399",
    info: "#818cf8",
  };

  return (
    <div
      className="rounded-2xl p-5 animate-fade-in-up transition-all duration-300"
      style={{
        background: bgMap[insight.type] || bgMap.info,
        border: `1px solid ${borderMap[insight.type] || borderMap.info}`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</span>
        <div className="min-w-0">
          <h4 className="text-sm font-bold mb-1"
            style={{ color: titleColorMap[insight.type] || titleColorMap.info }}>
            {insight.title}
          </h4>
          <p className="text-sm leading-relaxed mb-0"
            style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
            {insight.message}
          </p>
          {insight.severity && (
            <span
              className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-md uppercase"
              style={{
                background: `${titleColorMap[insight.type]}15`,
                color: titleColorMap[insight.type],
                letterSpacing: '0.05em',
              }}
            >
              {insight.severity} priority
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
