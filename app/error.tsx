"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface unexpected errors to the console in dev / to telemetry in prod
    console.error(error);
  }, [error]);

  return (
    <Container className="py-section">
      <div className="max-w-2xl mx-auto text-center">
        <p className="type-meta text-stone">Something went wrong</p>
        <h1 className="type-title text-ink mt-tight">
          A page came loose from the binding.
        </h1>
        <p className="type-body text-stone mt-tight">
          An unexpected error stopped this page from loading. Try again, or head back to the index.
        </p>
        <div className="mt-block flex flex-wrap items-center justify-center gap-x-block gap-y-tight">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center type-ui px-5 py-3 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="link-draw type-ui text-stone hover:text-ink"
          >
            Return home
          </Link>
        </div>
        {error.digest ? (
          <p className="type-meta text-stone/60 mt-block">Reference: {error.digest}</p>
        ) : null}
      </div>
    </Container>
  );
}
