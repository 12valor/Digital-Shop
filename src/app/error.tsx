"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-white px-4">
      <div className="max-w-md border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-black text-red-900">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-red-800">
          The page failed to load. Try again, and check the server logs if it continues.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 h-10 bg-red-700 px-4 text-sm font-bold text-white hover:bg-red-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
