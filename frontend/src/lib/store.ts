"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", newTheme === "dark");
        }
      },
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", state.theme === "dark");
        }
      },
    }
  )
);

interface UserState {
  user: {
    id: string;
    email: string;
    name: string;
    role: "student" | "recruiter";
  } | null;
  setUser: (user: UserState["user"]) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

interface TestState {
  currentTestId: string | null;
  timeRemaining: number;
  isFullscreen: boolean;
  violations: Array<{ type: string; timestamp: Date; description: string }>;
  setCurrentTest: (testId: string | null) => void;
  setTimeRemaining: (time: number) => void;
  setFullscreen: (isFullscreen: boolean) => void;
  addViolation: (violation: { type: string; description: string }) => void;
  clearViolations: () => void;
}

export const useTestStore = create<TestState>((set, get) => ({
  currentTestId: null,
  timeRemaining: 0,
  isFullscreen: false,
  violations: [],
  setCurrentTest: (testId) => set({ currentTestId: testId }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  addViolation: (violation) =>
    set({
      violations: [
        ...get().violations,
        { ...violation, timestamp: new Date() },
      ],
    }),
  clearViolations: () => set({ violations: [] }),
}));
