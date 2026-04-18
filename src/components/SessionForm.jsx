import { useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES } from "../utils/calculations";
import { validateSessionForm } from "../utils/validators";

const initialValues = {
  activity: "",
  category: "",
  duration: "",
  focusLevel: "",
  outcomeScore: "",
  date: new Date().toISOString().split("T")[0],
};

const SessionForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const { isDark } = useTheme();
  const [values, setValues] = useState(initialData || initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setSuccess(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSuccess(false);

      const validation = validateSessionForm(values);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setSuccess(true);
        if (!isEditing) {
          setValues(initialValues);
        }
      } catch (err) {
        setErrors({ form: "Failed to save session. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, isEditing]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <div className="rounded-xl p-3 text-sm" style={{
          background: 'rgba(239,68,68,0.1)',
          color: '#f87171',
          border: '1px solid rgba(239,68,68,0.2)',
        }}>
          {errors.form}
        </div>
      )}

      {success && (
        <div className="rounded-xl p-3 text-sm" style={{
          background: 'rgba(16,185,129,0.1)',
          color: '#34d399',
          border: '1px solid rgba(16,185,129,0.2)',
        }}>
          ✅ Session {isEditing ? "updated" : "added"} successfully!
        </div>
      )}

      {/* Activity Name */}
      <div>
        <label className="form-label" htmlFor="activity">Activity Name</label>
        <input
          id="activity"
          name="activity"
          type="text"
          className="input-field"
          placeholder="e.g., Deep Work on React Project"
          value={values.activity}
          onChange={handleChange}
        />
        {errors.activity && <ErrorText>{errors.activity}</ErrorText>}
      </div>

      {/* Category + Date Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="select-field"
            value={values.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <ErrorText>{errors.category}</ErrorText>}
        </div>
        <div>
          <label className="form-label" htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            className="input-field"
            value={values.date}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="form-label" htmlFor="duration">Duration (minutes)</label>
        <input
          id="duration"
          name="duration"
          type="number"
          className="input-field"
          placeholder="e.g., 90"
          min="1"
          max="720"
          value={values.duration}
          onChange={handleChange}
        />
        {errors.duration && <ErrorText>{errors.duration}</ErrorText>}
      </div>

      {/* Focus Level */}
      <div>
        <label className="form-label">Focus Level</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => {
                setValues((p) => ({ ...p, focusLevel: String(level) }));
                setErrors((p) => ({ ...p, focusLevel: null }));
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer border-0"
              style={{
                background: String(values.focusLevel) === String(level)
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : (isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)'),
                color: String(values.focusLevel) === String(level)
                  ? 'white'
                  : (isDark ? '#94a3b8' : '#64748b'),
                border: String(values.focusLevel) === String(level)
                  ? 'none'
                  : `1px solid ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}`,
                boxShadow: String(values.focusLevel) === String(level)
                  ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
              }}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Very Low</span>
          <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Deep Focus</span>
        </div>
        {errors.focusLevel && <ErrorText>{errors.focusLevel}</ErrorText>}
      </div>

      {/* Outcome Score */}
      <div>
        <label className="form-label">Outcome Score</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => {
                setValues((p) => ({ ...p, outcomeScore: String(score) }));
                setErrors((p) => ({ ...p, outcomeScore: null }));
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer border-0"
              style={{
                background: String(values.outcomeScore) === String(score)
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : (isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)'),
                color: String(values.outcomeScore) === String(score)
                  ? 'white'
                  : (isDark ? '#94a3b8' : '#64748b'),
                border: String(values.outcomeScore) === String(score)
                  ? 'none'
                  : `1px solid ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}`,
                boxShadow: String(values.outcomeScore) === String(score)
                  ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              {score}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Poor</span>
          <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Excellent</span>
        </div>
        {errors.outcomeScore && <ErrorText>{errors.outcomeScore}</ErrorText>}
      </div>

      {/* Live Preview */}
      {values.duration && values.focusLevel && values.outcomeScore && (
        <div className="rounded-xl p-4 animate-fade-in" style={{
          background: isDark ? 'rgba(99, 102, 241, 0.06)' : 'rgba(99, 102, 241, 0.04)',
          border: `1px solid ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}`,
        }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#818cf8' }}>
            📊 Live Score Preview
          </p>
          <div className="grid grid-cols-3 gap-3">
            <PreviewMetric
              label="Attention"
              value={Number(values.duration) * Number(values.focusLevel)}
              isDark={isDark}
            />
            <PreviewMetric
              label="ROA"
              value={Number(values.duration) * Number(values.focusLevel) * Number(values.outcomeScore)}
              isDark={isDark}
              color="#34d399"
            />
            <PreviewMetric
              label="Efficiency"
              value={`${Math.round((Number(values.focusLevel) * Number(values.outcomeScore) / 25) * 100)}%`}
              isDark={isDark}
              color="#fbbf24"
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary w-full text-center"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : isEditing
          ? "Update Session"
          : "Log Attention Session"}
      </button>
    </form>
  );
};

const ErrorText = ({ children }) => (
  <p className="text-xs mt-1 mb-0" style={{ color: "#f87171" }}>
    {children}
  </p>
);

const PreviewMetric = ({ label, value, isDark, color = "#818cf8" }) => (
  <div className="text-center">
    <p className="text-xs font-semibold mb-1" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
      {label}
    </p>
    <p className="text-lg font-bold mb-0" style={{ color }}>{value}</p>
  </div>
);

export default SessionForm;
