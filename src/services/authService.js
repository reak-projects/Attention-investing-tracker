import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

// ─── Local Storage Auth (Demo Mode) ──────────────────────────────

const LOCAL_USERS_KEY = "ait_users";
const LOCAL_CURRENT_USER_KEY = "ait_current_user";

let localAuthListeners = [];

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const getLocalCurrentUser = () => {
  try {
    const user = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const setLocalCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
  }
  // Notify listeners
  localAuthListeners.forEach((cb) => cb(user));
};

const localSignUp = (email, password, displayName) => {
  const users = getLocalUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) throw { code: "auth/email-already-in-use" };

  const user = {
    uid: "local_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8),
    email,
    displayName,
    createdAt: new Date().toISOString(),
  };
  users.push({ ...user, password });
  saveLocalUsers(users);
  setLocalCurrentUser(user);
  return user;
};

const localLogIn = (email, password) => {
  const users = getLocalUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) throw { code: "auth/invalid-credential" };

  const { password: _, ...user } = found;
  setLocalCurrentUser(user);
  return user;
};

const localLogOut = () => {
  setLocalCurrentUser(null);
};

const localOnAuthChange = (callback) => {
  localAuthListeners.push(callback);
  // Immediately fire with current state
  const current = getLocalCurrentUser();
  setTimeout(() => callback(current), 0);
  // Return unsubscribe
  return () => {
    localAuthListeners = localAuthListeners.filter((cb) => cb !== callback);
  };
};

// ─── Exports (auto-select Firebase or Local) ────────────────────

export const signUp = async (email, password, displayName) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  }
  return localSignUp(email, password, displayName);
};

export const logIn = async (email, password) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }
  return localLogIn(email, password);
};

export const logOut = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
    return;
  }
  localLogOut();
};

export const onAuthChange = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return localOnAuthChange(callback);
};
