import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="py-section">
      <div className="max-w-2xl">
        <p className="type-meta text-ink nums">404</p>
        <h1 className="type-title text-ink mt-tight">
          This page has drifted out of the archipelago.
        </h1>
        <p className="type-body text-ink mt-tight">
          The page you&apos;re looking for can&apos;t be found. It may have moved,
          or the link might be incomplete.
        </p>
        <div className="mt-block flex flex-wrap gap-x-block gap-y-tight">
          <Link href="/" className="link-draw type-ui text-ink">
            Return home
          </Link>
          <Link href="/projects" className="link-draw type-ui text-ink">
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
