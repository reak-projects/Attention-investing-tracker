import { useTheme } from "../context/ThemeContext";

const EmptyState = ({ icon = "📭", title, message, action }) => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
        {title}
      </h3>
      <p className="text-sm max-w-md mb-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
        {message}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
