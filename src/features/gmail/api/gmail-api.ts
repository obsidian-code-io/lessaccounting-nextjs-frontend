import { apiFetch } from "@/src/global/lib/api";

export interface GmailEmail {
  id: string;
  email_id: string;
  thread_id: string | null;
  from_email: string | null;
  to_email: string | null;
  subject: string | null;
  snippet: string | null;
  label_ids: string[] | null;
  received_at: string | null;
  created_at: string;
}

export interface GmailSyncResponse {
  synced_count: number;
  message: string;
}

export function syncGmailEmails(token: string, maxResults = 100) {
  return apiFetch<GmailSyncResponse>(
    `/gmail/sync?max_results=${maxResults}`,
    { method: "POST", token }
  );
}

export function fetchGmailEmails(
  token: string,
  limit = 50,
  offset = 0
) {
  return apiFetch<GmailEmail[]>(
    `/gmail/emails?limit=${limit}&offset=${offset}`,
    { token }
  );
}
