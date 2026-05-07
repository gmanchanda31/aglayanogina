"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { aboutNav, navSections, siteName } from "@/lib/content";
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

  // Lock body scroll while the mobile sheet is open + close on route change
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/95 backdrop-blur-sm">
      <Container as="nav" className="flex items-center justify-between py-5 md:py-6">
        <Link
          href="/"
          aria-label={`${siteName} — home`}
          className="font-[family-name:var(--font-vollkorn)] text-base md:text-lg uppercase tracking-[0.18em] text-ink"
        >
          {siteName}
        </Link>

        <ul className="hidden md:flex items-center gap-7 lg:gap-9">
          {allLinks.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "label-caps relative pb-1 transition-colors",
                    active
                      ? "text-ink after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-clay"
                      : "text-stone hover:text-ink",
                  )}
                >
                  {link.title}
                </Link>
              </li>
            );
          })}
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

      <MobileNav open={mobileOpen} pathname={pathname} />
    </header>
  );
}

function MobileNav({ open, pathname }: { open: boolean; pathname: string }) {
  return (
    <div
      id="mobile-nav"
      className={cn(
        "md:hidden fixed inset-x-0 top-[57px] bottom-0 z-30 bg-paper transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <Container className="flex flex-col gap-1 pt-12">
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
      </Container>
    </div>
  );
}
