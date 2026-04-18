import { createContext, useState, useEffect, useCallback, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import {
  addSession as addSessionService,
  updateSession as updateSessionService,
  deleteSession as deleteSessionService,
  subscribeToSessions,
} from "../services/sessionService";
import { enrichSession, calcAggregateStats } from "../utils/calculations";
import { generateInsights, generateWeeklySummary } from "../utils/insights";

const SessionContext = createContext(null);

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
};

export const SessionProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Real-time subscription to Firestore
  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToSessions(user.uid, (data) => {
      setSessions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Add session
  const addSession = useCallback(
    async (sessionData) => {
      if (!user) throw new Error("Must be logged in");
      setError(null);
      try {
        await addSessionService(user.uid, {
          ...sessionData,
          duration: Number(sessionData.duration),
          focusLevel: Number(sessionData.focusLevel),
          outcomeScore: Number(sessionData.outcomeScore),
          date: sessionData.date || new Date().toISOString().split("T")[0],
        });
      } catch (err) {
        setError("Failed to add session");
        throw err;
      }
    },
    [user]
  );

  // Update session
  const updateSession = useCallback(async (sessionId, updates) => {
    setError(null);
    try {
      await updateSessionService(sessionId, updates);
    } catch (err) {
      setError("Failed to update session");
      throw err;
    }
  }, []);

  // Delete session
  const deleteSession = useCallback(async (sessionId) => {
    setError(null);
    try {
      await deleteSessionService(sessionId);
    } catch (err) {
      setError("Failed to delete session");
      throw err;
    }
  }, []);

  // Enriched sessions with computed scores
  const enrichedSessions = useMemo(
    () => sessions.map(enrichSession),
    [sessions]
  );

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    let result = enrichedSessions;
    if (filterCategory !== "All") {
      result = result.filter((s) => s.category === filterCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.activity.toLowerCase().includes(q));
    }
    return result;
  }, [enrichedSessions, filterCategory, searchQuery]);

  // Aggregate stats
  const stats = useMemo(
    () => calcAggregateStats(enrichedSessions),
    [enrichedSessions]
  );

  // Insights
  const insights = useMemo(
    () => generateInsights(sessions),
    [sessions]
  );

  // Weekly summary
  const weeklySummary = useMemo(
    () => generateWeeklySummary(sessions),
    [sessions]
  );

  const clearError = useCallback(() => setError(null), []);

  const value = {
    sessions: enrichedSessions,
    filteredSessions,
    loading,
    error,
    stats,
    insights,
    weeklySummary,
    filterCategory,
    searchQuery,
    setFilterCategory,
    setSearchQuery,
    addSession,
    updateSession,
    deleteSession,
    clearError,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionContext;
