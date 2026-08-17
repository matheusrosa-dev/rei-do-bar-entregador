import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UseSessionStore } from "./types";

export const useSessionStore = create<UseSessionStore>()(
  persist(
    (set) => ({
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),

      session: null,
      createSession: (session) => set({ session }),
      destroySession: () => set({ session: null }),
    }),
    {
      name: "session-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
