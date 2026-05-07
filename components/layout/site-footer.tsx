import Link from "next/link";
import { contact, siteCity, siteName } from "@/lib/content";
import { Container } from "./container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist mt-32">
      <Container className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        <div>
          <Link
            href="/"
            aria-label={`${siteName} — home`}
            className="font-[family-name:var(--font-vollkorn)] text-base uppercase tracking-[0.18em] text-ink"
          >
            {siteName}
          </Link>
          <p className="mt-4 text-stone font-[family-name:var(--font-inter)] text-base leading-[1.65]">
            {siteCity}
          </p>
          <p className="mt-2 label-caps text-stone">© {year} Aglaya Nogina</p>
        </div>

        <div>
          <p className="label-caps text-ink">Connect</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={contact.emailHref}
                className="label-caps text-stone hover:text-ink transition-colors"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps text-stone hover:text-ink transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps text-stone hover:text-ink transition-colors"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-caps text-ink">Studio</p>
          <p className="mt-4 text-stone text-base leading-[1.65]">
            Available for commissions, exhibitions, and editorial collaborations.
          </p>
          <a
            href={contact.patreonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block label-caps text-stone border-b border-stone hover:text-ink hover:border-ink transition-colors"
          >
            Support on Patreon
          </a>
        </div>
      </Container>
    </footer>
  );
}
