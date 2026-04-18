import { useTheme } from "../context/ThemeContext";

const LoadingSpinner = ({ fullScreen = false, size = "md" }) => {
  const { isDark } = useTheme();

  const sizeMap = {
    sm: { width: 24, border: 3 },
    md: { width: 40, border: 4 },
    lg: { width: 56, border: 5 },
  };

  const { width, border } = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div
        style={{
          width,
          height: width,
          border: `${border}px solid ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'}`,
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {fullScreen && (
        <p className="text-sm font-medium" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          Loading your attention data...
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50"
        style={{ background: isDark ? '#020617' : '#f8fafc' }}>
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default LoadingSpinner;
