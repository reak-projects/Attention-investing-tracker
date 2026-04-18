import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { validateEmail, validatePassword, validateDisplayName } from "../utils/validators";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, error: authError, clearError, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = {};

      if (!isLogin) {
        const nameErr = validateDisplayName(formData.displayName);
        if (nameErr) newErrors.displayName = nameErr;
      }

      const emailErr = validateEmail(formData.email);
      if (emailErr) newErrors.email = emailErr;

      const passErr = validatePassword(formData.password);
      if (passErr) newErrors.password = passErr;

      if (!isLogin && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        if (isLogin) {
          await login(formData.email, formData.password);
        } else {
          await signup(formData.email, formData.password, formData.displayName);
        }
        navigate("/dashboard");
      } catch (err) {
        // Error is handled within the context
      } finally {
        setIsSubmitting(false);
      }
    },
    [isLogin, formData, login, signup, navigate]
  );

  const toggleMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setErrors({});
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.35)',
            }}>
            🎯
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
            Attention<span style={{ color: '#6366f1' }}>Tracker</span>
          </h1>
          <p className="text-sm" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
            Measure your Return on Attention
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 animate-pulse-glow">
          <h2 className="text-xl font-bold mb-6 text-center"
            style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {authError && (
            <div className="rounded-xl p-3 mb-4 text-sm animate-fade-in" style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="form-label" htmlFor="displayName">Full Name</label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.displayName}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {errors.displayName && (
                  <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.displayName}</p>
                )}
              </div>
            )}

            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="btn-primary w-full text-center"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                id="toggle-auth-mode"
                onClick={toggleMode}
                className="ml-1 font-semibold border-0 bg-transparent cursor-pointer"
                style={{ color: '#818cf8' }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: "📊", label: "ROA Analytics" },
            { icon: "🧠", label: "Smart Insights" },
            { icon: "⚡", label: "Focus Tracking" },
          ].map((f) => (
            <div key={f.label} className="text-center p-3 rounded-xl"
              style={{ background: isDark ? 'rgba(30,41,59,0.4)' : 'rgba(255,255,255,0.4)' }}>
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-xs font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
