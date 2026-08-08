"use client";

// AuthContext — mock authentication layer.
//
// NOTE ON PRODUCTION STACK: the spec calls for Clerk (auth) + Supabase (user
// storage). This build has no Clerk/Supabase project credentials connected,
// so this context reproduces the same *shape* of API (signUp, signIn,
// signOut, user, isLoaded) against a local mock store, persisted to
// localStorage so the app is usable end-to-end. Swapping in real Clerk +
// Supabase later means replacing the body of these functions only — every
// page already consumes this context, not Clerk directly. See README.md.

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "depgreen_auth_v1";

function loadStore() {
  if (typeof window === "undefined") return { users: [], currentUserId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { users: [], currentUserId: null };
  } catch {
    return { users: [], currentUserId: null };
  }
}

function saveStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function AuthProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const store = loadStore();
    const current = store.users.find((u) => u.id === store.currentUserId) || null;
    setUser(current);
    setIsLoaded(true);
  }, []);

  const signUp = useCallback(async (payload) => {
    // payload: { accountType, firstName, middleName, lastName, username,
    //            phone, email, dob, country, lga, address, password, setId }
    await new Promise((r) => setTimeout(r, 700)); // simulate network + verification
    const store = loadStore();
    if (store.users.some((u) => u.email === payload.email || u.username === payload.username)) {
      throw new Error("An account with that email or username already exists.");
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    store.users.push(newUser);
    store.currentUserId = newUser.id;
    saveStore(store);
    setUser(newUser);
    return newUser;
  }, []);

  const signIn = useCallback(async ({ identifier, password }) => {
    await new Promise((r) => setTimeout(r, 600));
    const store = loadStore();
    const found = store.users.find(
      (u) => (u.email === identifier || u.username === identifier) && u.password === password
    );
    if (!found) {
      throw new Error("We couldn't find an account with those details.");
    }
    store.currentUserId = found.id;
    saveStore(store);
    setUser(found);
    return found;
  }, []);

  const signOut = useCallback(() => {
    const store = loadStore();
    store.currentUserId = null;
    saveStore(store);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    const store = loadStore();
    const idx = store.users.findIndex((u) => u.id === store.currentUserId);
    if (idx === -1) return;
    store.users[idx] = { ...store.users[idx], ...patch };
    saveStore(store);
    setUser(store.users[idx]);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoaded, user, signUp, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
