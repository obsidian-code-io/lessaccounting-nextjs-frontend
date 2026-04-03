"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/src/features/auth";
import { syncGmailEmails, fetchGmailEmails } from "../api/gmail-api";

export function useSyncGmail() {
  const session = useAuthStore((s) => s.session);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (maxResults = 100) =>
      syncGmailEmails(session!.access_token, maxResults),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail-emails"] });
    },
  });
}

export function useGmailEmails(limit = 50, offset = 0) {
  const session = useAuthStore((s) => s.session);

  return useQuery({
    queryKey: ["gmail-emails", limit, offset],
    queryFn: () => fetchGmailEmails(session!.access_token, limit, offset),
    enabled: !!session?.access_token,
  });
}
