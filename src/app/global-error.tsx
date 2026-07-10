"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center bg-white px-4">
          <section className="w-full max-w-md border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-red-700">
              Critical error
            </p>
            <h1 className="mt-2 text-2xl font-black text-red-950">
              The shop could not load
            </h1>
            <p className="mt-2 text-sm leading-6 text-red-800">
              We logged the failure. Try reloading the page.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 h-11 bg-red-700 px-5 text-sm font-black text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Reload
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
