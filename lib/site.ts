/**
 * Resolve the canonical site URL across environments.
 *
 * Order of precedence:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override (set this once a real domain is wired)
 *  2. VERCEL_PROJECT_PRODUCTION_URL — the host configured for the prod branch
 *     (set automatically by Vercel for production deployments)
 *  3. VERCEL_URL — the per-deployment host (preview deploys, production fallback)
 *  4. http://localhost:3000 — local dev
 *
 * Used as the metadataBase for absolute OG / canonical URLs, and printed in
 * the OG image's brand line.
 */
export const SITE_URL: string = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prodHost) return `https://${prodHost}`;

  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost) return `https://${deploymentHost}`;

  return "http://localhost:3000";
})();

/** Hostname only — used as the brand-line text inside OG images. */
export const SITE_HOST: string = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
})();
