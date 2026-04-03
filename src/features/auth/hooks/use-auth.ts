"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createClient } from "@/src/lib/supabase";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { fetchProfile, saveTokens } from "@/src/features/auth/api/auth-api";

const supabase = createClient();

export function useAuthListener() {
  const { setSession, setProviderToken, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.provider_token) {
        setProviderToken(session.provider_token);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setProviderToken, setLoading]);
}

export function useProfile() {
  const session = useAuthStore((s) => s.session);

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(session!.access_token),
    enabled: !!session?.access_token,
  });
}

export function useSaveTokens() {
  const session = useAuthStore((s) => s.session);

  return useMutation({
    mutationFn: ({
      providerToken,
      providerRefreshToken,
    }: {
      providerToken: string;
      providerRefreshToken?: string;
    }) =>
      saveTokens(
        session!.access_token,
        providerToken,
        providerRefreshToken
      ),
  });
}

export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/gmail.readonly",
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    },
  });
}

export function useSignOut() {
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: clear,
  });
}
