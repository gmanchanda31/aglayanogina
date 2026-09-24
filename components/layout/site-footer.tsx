import Link from "next/link";
import { contact, siteCity, siteName } from "@/lib/content";
import { Container } from "./container";

/** 44px tap rows on mobile; compact list from md up */
const footerLink =
  "type-ui text-stone hover:text-ink transition-colors inline-flex items-center min-h-11 md:min-h-0";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist mt-24 md:mt-32">
      <Container className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        <div>
          <Link
            href="/"
            aria-label={`${siteName} — home`}
            className="type-meta text-ink"
          >
            {siteName}
          </Link>
          <p className="mt-4 type-ui text-stone">
            {siteCity}
          </p>
          <p className="mt-2 type-meta text-stone">© {year} Aglaya Nogina</p>
        </div>

        <div>
          <p className="type-meta text-ink">Connect</p>
          <ul className="mt-3 md:mt-4 md:space-y-2">
            <li>
              <a href={contact.emailHref} className={footerLink}>
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLink}
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLink}
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="type-meta text-ink">Studio</p>
          <p className="mt-4 type-ui text-stone">
            Available for commissions, exhibitions, and editorial collaborations.
          </p>
        </div>
      </Container>
    </footer>
  );
}
