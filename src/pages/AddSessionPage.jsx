import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useTheme } from "../context/ThemeContext";
import SessionForm from "../components/SessionForm";

const AddSessionPage = () => {
  const { addSession } = useSession();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data) => {
      await addSession(data);
    },
    [addSession]
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1"
          style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
          Log Attention Session
        </h1>
        <p className="text-sm" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
          Record where you invested your attention and measure the return
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card p-6 sm:p-8 animate-fade-in-up">
        <SessionForm onSubmit={handleSubmit} />
      </div>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 stagger-children">
        <TipCard
          icon="🎯"
          title="Be Specific"
          text="Use descriptive activity names like 'React hooks deep dive' instead of just 'Studying'"
          isDark={isDark}
          delay={0}
        />
        <TipCard
          icon="🧠"
          title="Rate Honestly"
          text="Honest focus and outcome scores help generate accurate insights"
          isDark={isDark}
          delay={80}
        />
        <TipCard
          icon="📈"
          title="Track Consistently"
          text="Regular logging reveals patterns and helps optimize your attention investment"
          isDark={isDark}
          delay={160}
        />
      </div>
    </div>
  );
};

const TipCard = ({ icon, title, text, isDark, delay }) => (
  <div
    className="rounded-xl p-4 animate-fade-in-up"
    style={{
      background: isDark ? 'rgba(30,41,59,0.4)' : 'rgba(255,255,255,0.5)',
      border: `1px solid ${isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)'}`,
      animationDelay: `${delay}ms`,
    }}
  >
    <div className="text-lg mb-1">{icon}</div>
    <h4 className="text-sm font-bold mb-1" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
      {title}
    </h4>
    <p className="text-xs leading-relaxed mb-0" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
      {text}
    </p>
  </div>
);

export default AddSessionPage;
