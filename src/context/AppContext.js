"use client";

// AppContext — global app state via Context API, per spec item 6
// ("Manage global states using the Context API").
//
// Holds: the household's collection cycle, payment/contribution status,
// the marketplace catalog, and the messaging groups. Backed by
// localStorage so the mock data feels persistent across a session.
// In production this state would be hydrated from Supabase + live agent
// data instead of the seed data below.

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AppContext = createContext(null);
const STORAGE_KEY = "depgreen_app_v1";

const RATES = {
  freehold: 5000,
  leasehold_tenant: 1000,
  business: 8000,
};

const CLEANING_EQUIPMENT = [
  { id: "eq_1", name: "Compound Waste Bin (120L)", price: 6500, quantity: 1, description: "Weatherproof bin sized for a single household, colour-matched to the DEPGREEN set." },
  { id: "eq_2", name: "Garbage Nylon (Pack of 20)", price: 1800, quantity: 20, description: "Tear-resistant bin liners for daily use, sized to fit the compound bin." },
  { id: "eq_3", name: "Long-Handle Compound Broom", price: 2200, quantity: 1, description: "Stiff-bristle broom for sweeping compound surfaces and drains." },
  { id: "eq_4", name: "Recycling Sort Basket", price: 3400, quantity: 1, description: "Two-chamber basket for separating plastics from general waste before pickup." },
  { id: "eq_5", name: "Hand Gloves (Pair)", price: 900, quantity: 2, description: "Reusable rubber gloves for safe handling during sorting and disposal." },
  { id: "eq_6", name: "Odour-Control Bin Spray", price: 1500, quantity: 1, description: "Neutralises smell between collection days, especially in hot weather." },
];

function seedCycle() {
  const today = new Date();
  const nextPickup = new Date(today);
  nextPickup.setDate(today.getDate() + 6);
  return {
    nextPickupDate: nextPickup.toISOString(),
    cycleLengthDays: 30,
    contributionComplete: false,
  };
}

function loadStore() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    cycle: seedCycle(),
    messages: {
      set: [
        { id: "m1", from: "Adaeze (Set Coordinator)", text: "Reminder: pickup moves to Thursday this week.", time: "9:12 AM" },
      ],
      neighborhood: [
        { id: "m2", from: "DEPGREEN Lagos", text: "Recycling bale prices increased this month — check the marketplace.", time: "Yesterday" },
      ],
      household: [],
      agent: [
        { id: "m3", from: "Agent Tunde", text: "I'll be at your block by 10am on collection day.", time: "Mon" },
      ],
      ai: [
        { id: "m4", from: "DepGreen AI", text: "Hi! Ask me how to clean your bin or sort plastics for recycling.", time: "Now" },
      ],
    },
  };
}

function saveStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function AppProvider({ children }) {
  const [cycle, setCycle] = useState(null);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const store = loadStore();
    setCycle(store.cycle);
    setMessages(store.messages);
  }, []);

  const persist = useCallback((next) => {
    saveStore(next);
  }, []);

  const completeContribution = useCallback(() => {
    setCycle((prev) => {
      const next = { ...prev, contributionComplete: true };
      const store = loadStore();
      persist({ ...store, cycle: next });
      return next;
    });
  }, [persist]);

  const advanceCycleAfterPickup = useCallback(() => {
    setCycle((prev) => {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + prev.cycleLengthDays);
      const next = { ...prev, nextPickupDate: nextDate.toISOString(), contributionComplete: false };
      const store = loadStore();
      persist({ ...store, cycle: next });
      return next;
    });
  }, [persist]);

  const sendMessage = useCallback((group, text, from = "You") => {
    setMessages((prev) => {
      const next = {
        ...prev,
        [group]: [...prev[group], { id: `m_${Date.now()}`, from, text, time: "Now" }],
      };
      const store = loadStore();
      persist({ ...store, messages: next });
      return next;
    });
  }, [persist]);

  return (
    <AppContext.Provider
      value={{
        cycle,
        messages,
        rates: RATES,
        equipment: CLEANING_EQUIPMENT,
        completeContribution,
        advanceCycleAfterPickup,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
