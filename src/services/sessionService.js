import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const SESSIONS_COLLECTION = "sessions";
const LOCAL_SESSIONS_KEY = "ait_sessions";

// ─── Local Storage Sessions (Demo Mode) ────────────────────────

let localSessionListeners = [];

const getLocalSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalSessions = (sessions) => {
  localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
  // Notify listeners
  localSessionListeners.forEach(({ userId, callback }) => {
    const userSessions = sessions
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(userSessions);
  });
};

// ─── Exports (auto-select Firebase or Local) ────────────────────

export const addSession = async (userId, sessionData) => {
  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
      ...sessionData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...sessionData, userId };
  }

  // Local mode
  const sessions = getLocalSessions();
  const newSession = {
    id: "local_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8),
    ...sessionData,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  saveLocalSessions(sessions);
  return newSession;
};

export const updateSession = async (sessionId, updates) => {
  if (isFirebaseConfigured && db) {
    const ref = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
    return;
  }

  // Local mode
  const sessions = getLocalSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx !== -1) {
    sessions[idx] = { ...sessions[idx], ...updates, updatedAt: new Date().toISOString() };
    saveLocalSessions(sessions);
  }
};

export const deleteSession = async (sessionId) => {
  if (isFirebaseConfigured && db) {
    const ref = doc(db, SESSIONS_COLLECTION, sessionId);
    await deleteDoc(ref);
    return;
  }

  // Local mode
  const sessions = getLocalSessions().filter((s) => s.id !== sessionId);
  saveLocalSessions(sessions);
};

export const getUserSessions = async (userId) => {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Local mode
  return getLocalSessions()
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const subscribeToSessions = (userId, callback) => {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(sessions);
    });
  }

  // Local mode — register listener and fire immediately
  const listener = { userId, callback };
  localSessionListeners.push(listener);

  // Fire immediately with current data
  const currentSessions = getLocalSessions()
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  setTimeout(() => callback(currentSessions), 0);

  // Return unsubscribe
  return () => {
    localSessionListeners = localSessionListeners.filter((l) => l !== listener);
  };
};
