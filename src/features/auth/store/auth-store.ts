import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  providerToken: string | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProviderToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  providerToken: null,
  isLoading: true,
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),
  setProviderToken: (providerToken) => set({ providerToken }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () =>
    set({
      session: null,
      user: null,
      providerToken: null,
      isLoading: false,
    }),
}));
