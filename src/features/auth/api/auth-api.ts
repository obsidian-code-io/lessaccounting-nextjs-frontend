import { apiFetch } from "@/src/lib/api";

export interface UserProfile {
  id: string;
  supabase_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function fetchProfile(token: string) {
  return apiFetch<UserProfile>("/auth/me", { token });
}

export function saveTokens(
  token: string,
  providerToken: string,
  providerRefreshToken?: string
) {
  return apiFetch<{ message: string }>("/auth/save-tokens", {
    method: "POST",
    token,
    body: JSON.stringify({
      provider_token: providerToken,
      provider_refresh_token: providerRefreshToken ?? null,
    }),
  });
}
