import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="py-32 md:py-48">
      <div className="max-w-2xl mx-auto text-center">
        <p className="label-caps text-stone">404</p>
        <h1 className="font-[family-name:var(--font-vollkorn)] italic text-4xl md:text-6xl leading-[1.15] text-ink mt-6">
          This page has drifted out of the archipelago.
        </h1>
        <p className="text-stone text-base md:text-lg leading-[1.6] mt-8">
          The page you&apos;re looking for can&apos;t be found. It may have moved,
          or the link might be incomplete.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center label-caps px-5 py-3 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
          >
            Return home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center label-caps px-5 py-3 text-stone hover:text-ink border-b border-stone hover:border-ink transition-colors"
          >
            View projects
          </Link>
        </div>
      </div>
    </Container>
  );
}

export const metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};
