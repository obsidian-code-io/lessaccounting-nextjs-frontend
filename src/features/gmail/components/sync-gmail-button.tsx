"use client";

import { useSyncGmail } from "../hooks/use-gmail";

export function SyncGmailButton() {
  const { mutate: sync, isPending, data, error } = useSyncGmail();

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => sync()}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isPending ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Syncing...
          </>
        ) : (
          "Sync Gmail"
        )}
      </button>
      {data && (
        <p className="text-xs text-green-600 dark:text-green-400">
          {data.message}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}
