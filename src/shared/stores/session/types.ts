import type { ISession } from "@/shared/models";

export type UseSessionStore = {
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;

  session: ISession | null;
  createSession: (session: ISession) => void;
  destroySession: () => void;
};
