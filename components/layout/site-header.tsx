"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { aboutNav, navSections, siteName } from "@/lib/site-config";
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
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on navigation (render-time, so no effect-driven re-render)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes the sheet and hands focus back to the toggle
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-mist bg-paper">
        <Container as="nav" className="flex items-center justify-between h-[var(--header-h)]">
          <Link
            href="/"
            aria-label={`${siteName} — home`}
            className="inline-flex items-center type-ui font-medium leading-none text-ink h-8"
          >
            {siteName}
          </Link>

          <ul className="hidden lg:flex items-center gap-7 xl:gap-9">
            {allLinks.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <li key={link.href} className="inline-flex h-8 items-center">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "type-ui inline-flex items-center h-full leading-none transition-colors relative",
                      active
                        ? "font-medium text-ink after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-clay"
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
            ref={toggleRef}
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center gap-2 h-11 -mr-2 px-2 type-ui text-ink"
          >
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
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
      data-mobile-nav
      data-open={open ? "true" : "false"}
      // Open/close choreography lives in the Motion block of globals.css;
      // inert keeps the closed sheet out of the tab order and the a11y tree
      inert={!open}
      className="lg:hidden fixed inset-x-0 top-[var(--header-h)] bottom-0 z-30 bg-paper overflow-y-auto"
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
                "type-lead py-3 border-b border-mist",
                active ? "text-ink font-medium" : "text-stone hover:text-ink",
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
