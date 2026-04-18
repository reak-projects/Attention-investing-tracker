import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { onAuthChange, logIn, signUp, logOut } from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const u = await logIn(email, password);
      setUser(u);
      return u;
    } catch (err) {
      const msg = getFirebaseErrorMessage(err.code);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    setError(null);
    setLoading(true);
    try {
      const u = await signUp(email, password, displayName);
      setUser(u);
      return u;
    } catch (err) {
      const msg = getFirebaseErrorMessage(err.code);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logOut();
      setUser(null);
    } catch (err) {
      setError("Failed to log out");
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = { user, loading, error, login, signup, logout, clearError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function getFirebaseErrorMessage(code) {
  const messages = {
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "An account already exists with this email",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/invalid-email": "Invalid email address",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    "auth/invalid-credential": "Invalid email or password",
  };
  return messages[code] || "Authentication failed. Please try again.";
}

export default AuthContext;
