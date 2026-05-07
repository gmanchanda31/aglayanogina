/**
 * Static, build-time-constant site configuration.
 *
 * Lives separately from lib/content.ts because:
 *   - lib/content.ts uses top-level await to fetch Sanity at build time
 *   - top-level await modules can't be imported by client components
 *   - SiteHeader (`"use client"`) needs siteName / navSections / contact
 *
 * Update Patreon URL etc here if it ever changes. The same values live in
 * Sanity's `artist` document for the server-rendered footer; in the rare
 * case they drift, this file is the source of truth for the client header.
 */

import type { Section } from "./types";

export const siteName = "Aglaya Nogina";

export const navSections: Array<{ title: string; href: string; section: Section }> = [
  { title: "Projects", href: "/projects", section: "projects" },
  { title: "Exhibitions", href: "/exhibitions", section: "exhibitions" },
  { title: "Illustrations", href: "/illustrations", section: "illustrations" },
  { title: "Photographs", href: "/photographs", section: "photographs" },
  { title: "Writings", href: "/writings", section: "writings" },
];

export const aboutNav = { title: "About", href: "/about" } as const;

export const contact = {
  email: "aglaya.nn.art@gmail.com",
  emailHref: "mailto:aglaya.nn.art@gmail.com",
  instagramHandle: "@aglaya.nn",
  instagramUrl: "https://www.instagram.com/aglaya.nn",
  whatsappNumber: "+49 175 6252702",
  whatsappUrl: "https://wa.me/491756252702",
  patreonUrl: "https://patreon.com/aglayann",
} as const;
