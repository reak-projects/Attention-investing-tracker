import { useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  getCategoryBadgeClass,
  formatDuration,
  getFocusLabel,
  getOutcomeLabel,
  getEfficiencyRating,
} from "../utils/calculations";

const SessionCard = ({ session, onDelete, onEdit }) => {
  const { isDark } = useTheme();
  const rating = getEfficiencyRating(session.efficiency);

  const handleDelete = useCallback(() => {
    if (window.confirm("Delete this session? This action cannot be undone.")) {
      onDelete(session.id);
    }
  }, [session.id, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(session);
  }, [session, onEdit]);

  return (
    <div className="glass-card p-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold mb-1 truncate"
            style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
            {session.activity}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge ${getCategoryBadgeClass(session.category)}`}>
              {session.category}
            </span>
            <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
              {session.date || "Today"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleEdit}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border-0 text-sm"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#818cf8',
            }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border-0 text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <MetricBox
          label="Duration"
          value={formatDuration(session.duration)}
          isDark={isDark}
        />
        <MetricBox
          label="Focus"
          value={`${session.focusLevel}/5`}
          subtext={getFocusLabel(session.focusLevel)}
          isDark={isDark}
        />
        <MetricBox
          label="Outcome"
          value={`${session.outcomeScore}/5`}
          subtext={getOutcomeLabel(session.outcomeScore)}
          isDark={isDark}
        />
      </div>

      {/* Scores Row */}
      <div className="flex items-center justify-between pt-3"
        style={{ borderTop: `1px solid ${isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)'}` }}>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: isDark ? '#64748b' : '#94a3b8' }}>ROA</span>
          <p className="text-lg font-bold mb-0" style={{ color: '#818cf8' }}>
            {session.roa?.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Efficiency</span>
          <div className="flex items-center gap-2">
            <div className="progress-bar" style={{ width: 60 }}>
              <div className="progress-bar-fill" style={{ width: `${session.efficiency}%` }} />
            </div>
            <span className="text-sm font-bold" style={{ color: rating.color }}>
              {session.efficiency}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, subtext, isDark }) => (
  <div className="rounded-xl p-2.5 text-center"
    style={{ background: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)' }}>
    <p className="text-xs font-semibold uppercase tracking-wider mb-1"
      style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{label}</p>
    <p className="text-sm font-bold mb-0" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
      {value}
    </p>
    {subtext && (
      <p className="text-xs mb-0 mt-0.5" style={{ color: isDark ? '#475569' : '#94a3b8' }}>
        {subtext}
      </p>
    )}
  </div>
);

export default SessionCard;
