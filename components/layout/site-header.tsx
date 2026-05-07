"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { aboutNav, contact, navSections, siteName } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "./container";

const allLinks = [...navSections, aboutNav] as const;

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-mist bg-paper">
        <Container as="nav" className="flex items-center justify-between py-5 md:py-6">
          <Link
            href="/"
            aria-label={`${siteName} — home`}
            className="inline-flex items-center font-[family-name:var(--font-vollkorn)] text-base md:text-lg uppercase tracking-[0.18em] leading-none text-ink h-8"
          >
            {siteName}
          </Link>

          <ul className="hidden md:flex items-center gap-7 lg:gap-9">
            {allLinks.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <li key={link.href} className="inline-flex h-8 items-center">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "label-caps inline-flex items-center h-full leading-none transition-colors relative",
                      active
                        ? "text-ink after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-clay"
                        : "text-stone hover:text-ink",
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
            <li className="ml-1 inline-flex h-8 items-center">
              <a
                href={contact.patreonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps inline-flex items-center h-full leading-none px-3.5 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
              >
                Support
              </a>
            </li>
          </ul>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center gap-2 label-caps text-ink"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span>{mobileOpen ? "Close" : "Menu"}</span>
          </button>
        </Container>
      </header>

      <MobileNav open={mobileOpen} pathname={pathname} />
    </>
  );
}

function MobileNav({ open, pathname }: { open: boolean; pathname: string }) {
  return (
    <div
      id="mobile-nav"
      className={cn(
        "md:hidden fixed inset-x-0 top-[65px] bottom-0 z-30 bg-paper transition-opacity duration-200 overflow-y-auto",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <Container className="flex flex-col gap-1 pt-10 pb-12">
        {allLinks.map((link) => {
          const active = isActive(link.href, pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "font-[family-name:var(--font-vollkorn)] text-4xl py-3 border-b border-mist transition-colors",
                active ? "text-ink" : "text-stone hover:text-ink",
              )}
            >
              {link.title}
            </Link>
          );
        })}

        <a
          href={contact.patreonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center label-caps px-5 py-4 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
        >
          Support on Patreon
        </a>
        <p className="mt-4 text-stone text-sm leading-[1.6] max-w-sm">
          Aglaya&apos;s practice is supported by readers and patrons. Joining the art diary helps her keep making.
        </p>
      </Container>
    </div>
  );
}
