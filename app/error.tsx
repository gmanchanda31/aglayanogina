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
    <Container className="py-32 md:py-48">
      <div className="max-w-2xl mx-auto text-center">
        <p className="label-caps text-stone">Something went wrong</p>
        <h1 className="font-[family-name:var(--font-vollkorn)] italic text-4xl md:text-5xl leading-[1.15] text-ink mt-6">
          A page came loose from the binding.
        </h1>
        <p className="text-stone text-base md:text-lg leading-[1.6] mt-8">
          An unexpected error stopped this page from loading. Try again, or head back to the index.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center label-caps px-5 py-3 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center label-caps px-5 py-3 text-stone hover:text-ink border-b border-stone hover:border-ink transition-colors"
          >
            Return home
          </Link>
        </div>
        {error.digest ? (
          <p className="label-caps text-stone/60 mt-12">Reference: {error.digest}</p>
        ) : null}
      </div>
    </Container>
  );
}
