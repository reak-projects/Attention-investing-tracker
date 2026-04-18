import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [logout]);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: isDark ? 'rgba(2, 6, 23, 0.85)' : 'rgba(248, 250, 252, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)'}`,
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 no-underline group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}>
              🎯
            </div>
            <span className="text-base font-bold hidden sm:block"
              style={{ color: isDark ? '#e0e7ff' : '#312e81' }}>
              Attention<span style={{ color: '#6366f1' }}>Tracker</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <NavLink to="/dashboard" active={isActive("/dashboard")} isDark={isDark}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>

            <NavLink to="/add-session" active={isActive("/add-session")} isDark={isDark}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Session</span>
            </NavLink>

            <NavLink to="/sessions" active={isActive("/sessions")} isDark={isDark}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden sm:inline">Sessions</span>
            </NavLink>

            <NavLink to="/reports" active={isActive("/reports")} isDark={isDark}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Reports</span>
            </NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border-0"
              style={{
                background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)',
              }}
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* User info */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                }}>
                {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {user.displayName || user.email?.split("@")[0]}
              </span>
            </div>

            {/* Logout */}
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-0"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, isDark, children }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200"
    style={{
      background: active
        ? (isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)')
        : 'transparent',
      color: active
        ? '#818cf8'
        : (isDark ? '#94a3b8' : '#64748b'),
    }}
  >
    {children}
  </Link>
);

export default Navbar;
