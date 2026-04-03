"use client";

import { useAuthListener, useSignOut, useProfile } from "@/src/features/auth";
import { GmailLoginButton } from "@/src/features/auth";
import { useAuthStore } from "@/src/features/auth";
import { SyncGmailButton, useGmailEmails } from "@/src/features/gmail";

export default function Home() {
  useAuthListener();
  const { session, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <LoginView />;
  }

  return <AuthenticatedView />;
}

function LoginView() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          LessAccounting
        </h1>
        <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
          Sign in with your Gmail account to sync and manage your emails.
        </p>
      </div>
      <GmailLoginButton />
    </div>
  );
}

function AuthenticatedView() {
  const { data: profile } = useProfile();
  const { mutate: signOut, isPending } = useSignOut();
  const { data: emails } = useGmailEmails();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {profile?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncGmailButton />
          <button
            onClick={() => signOut()}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {isPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {emails && emails.length > 0 ? (
          <div className="mx-auto max-w-3xl space-y-2">
            {emails.map((email) => (
              <div
                key={email.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black dark:text-zinc-100">
                      {email.subject || "(No subject)"}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {email.from_email}
                    </p>
                  </div>
                  {email.received_at && (
                    <span className="shrink-0 text-xs text-zinc-400">
                      {new Date(email.received_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {email.snippet && (
                  <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-500">
                    {email.snippet}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-zinc-400">
              No emails yet. Click &quot;Sync Gmail&quot; to fetch your emails.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
