import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <p className="type-meta text-stone nums">404</p>
        <h1 className="type-title text-ink mt-4">
          This page has drifted out of the archipelago.
        </h1>
        <p className="type-body text-stone mt-6">
          The page you&apos;re looking for can&apos;t be found. It may have moved,
          or the link might be incomplete.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/" className="link-draw type-ui text-ink">
            Return home
          </Link>
          <Link href="/projects" className="link-draw type-ui text-stone hover:text-ink">
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
