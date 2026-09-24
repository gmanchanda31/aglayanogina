import Link from "next/link";
import { contact, siteCity, siteName } from "@/lib/content";
import { Container } from "./container";

/** 44px tap rows on mobile; compact list from md up */
const footerLink =
  "type-ui text-ink transition-colors inline-flex items-center min-h-11 md:min-h-0";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist mt-section">
      <Container className="py-block grid grid-cols-1 md:grid-cols-3 gap-block">
        <div>
          <Link
            href="/"
            aria-label={`${siteName} — home`}
            className="type-meta text-ink"
          >
            {siteName}
          </Link>
          <p className="mt-tight type-ui text-ink">
            {siteCity}
          </p>
          <p className="type-meta text-ink">© {year} Aglaya Nogina</p>
        </div>

        <div>
          <p className="type-meta text-ink">Connect</p>
          <ul className="mt-tight">
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
          <p className="mt-tight type-ui text-ink">
            Available for commissions, exhibitions, and editorial collaborations.
          </p>
        </div>
      </Container>
    </footer>
  );
}
