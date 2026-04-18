import { useState, useCallback, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useTheme } from "../context/ThemeContext";
import SessionCard from "../components/SessionCard";
import SessionForm from "../components/SessionForm";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import { CATEGORIES } from "../utils/calculations";

const SessionsPage = () => {
  const {
    filteredSessions,
    loading,
    filterCategory,
    searchQuery,
    setFilterCategory,
    setSearchQuery,
    deleteSession,
    updateSession,
  } = useSession();
  const { isDark } = useTheme();

  const [editingSession, setEditingSession] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleSearchChange = useCallback((e) => {
    setLocalSearch(e.target.value);
  }, []);

  const handleDelete = useCallback(
    async (sessionId) => {
      try {
        await deleteSession(sessionId);
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    },
    [deleteSession]
  );

  const handleEdit = useCallback((session) => {
    setEditingSession(session);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleUpdate = useCallback(
    async (data) => {
      if (!editingSession) return;
      await updateSession(editingSession.id, {
        ...data,
        duration: Number(data.duration),
        focusLevel: Number(data.focusLevel),
        outcomeScore: Number(data.outcomeScore),
      });
      setEditingSession(null);
    },
    [editingSession, updateSession]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingSession(null);
  }, []);

  const handleCategoryFilter = useCallback(
    (cat) => setFilterCategory(cat),
    [setFilterCategory]
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
            All Sessions
          </h1>
          <p className="text-sm" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
            {filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link to="/add-session" className="btn-primary no-underline inline-block text-center">
          + New Session
        </Link>
      </div>

      {/* Edit Modal */}
      {editingSession && (
        <div className="glass-card p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
              ✏️ Editing: {editingSession.activity}
            </h3>
            <button onClick={handleCancelEdit} className="btn-secondary">Cancel</button>
          </div>
          <SessionForm
            onSubmit={handleUpdate}
            initialData={{
              activity: editingSession.activity,
              category: editingSession.category,
              duration: String(editingSession.duration),
              focusLevel: String(editingSession.focusLevel),
              outcomeScore: String(editingSession.outcomeScore),
              date: editingSession.date || new Date().toISOString().split("T")[0],
            }}
            isEditing
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in">
        {/* Search */}
        <div className="flex-1">
          <input
            id="search-sessions"
            type="text"
            className="input-field"
            placeholder="🔍 Search activities..."
            value={localSearch}
            onChange={handleSearchChange}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            label="All"
            active={filterCategory === "All"}
            onClick={() => handleCategoryFilter("All")}
            isDark={isDark}
          />
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              active={filterCategory === cat}
              onClick={() => handleCategoryFilter(cat)}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Sessions Found"
          message={
            searchQuery || filterCategory !== "All"
              ? "Try adjusting your search or filter criteria."
              : "You haven't logged any sessions yet. Start tracking your attention!"
          }
          action={
            <Link to="/add-session" className="btn-primary no-underline inline-block">
              + Log Your First Session
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ label, active, onClick, isDark }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-0"
    style={{
      background: active
        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
        : (isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.6)'),
      color: active ? 'white' : (isDark ? '#94a3b8' : '#64748b'),
      boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
      border: active ? 'none' : `1px solid ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}`,
    }}
  >
    {label}
  </button>
);

export default SessionsPage;
