"use client";

import { useAuthListener, useSignOut, useProfile } from "@/src/features/auth";
import { GmailLoginButton } from "@/src/features/auth";
import { useAuthStore } from "@/src/features/auth";

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

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {profile?.email}
        </p>
      </div>
      <button
        onClick={() => signOut()}
        disabled={isPending}
        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {isPending ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
