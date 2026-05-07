/**
 * Configure (or update) the Sanity → Vercel publish webhook.
 *
 * Run from repo root with the Vercel deploy hook URL:
 *
 *   VERCEL_DEPLOY_HOOK_URL='https://api.vercel.com/v1/integrations/deploy/...' \
 *     node --env-file=.env.local scripts/configure-webhook.mjs
 *
 * Idempotent: re-running with the same URL upserts the same webhook.
 *
 * Triggers a rebuild whenever ANY published doc changes (create / update /
 * delete) in the production dataset. Drafts don't fire builds.
 */

const TOKEN = process.env.SANITY_WRITE_TOKEN;
const PROJECT_ID = process.env.SANITY_PROJECT_ID || "w6axlzhx";
const DEPLOY_URL = process.env.VERCEL_DEPLOY_HOOK_URL;

if (!TOKEN) {
  console.error("SANITY_WRITE_TOKEN missing.");
  process.exit(1);
}
if (!DEPLOY_URL) {
  console.error("VERCEL_DEPLOY_HOOK_URL missing — paste it as an env var.");
  process.exit(1);
}

const HOOK_NAME = "Vercel rebuild on publish";
const API = `https://api.sanity.io/v2025-01-01/hooks/projects/${PROJECT_ID}`;

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

const existing = await api("");
const ours = (existing.hooks ?? existing).find?.((h) => h.name === HOOK_NAME) ??
  (Array.isArray(existing) ? existing.find((h) => h.name === HOOK_NAME) : undefined);

const payload = {
  name: HOOK_NAME,
  type: "document",
  url: DEPLOY_URL,
  on: ["create", "update", "delete"],
  filter: '_type in ["artist", "homePicks", "project", "exhibition", "illustration", "photographSet", "writing"]',
  httpMethod: "POST",
  apiVersion: "v2025-01-01",
  includeDrafts: false,
  description:
    "Fires the Vercel deploy hook so aglayanogina.art rebuilds with the latest published content.",
};

if (ours?.id) {
  console.log(`Updating existing hook ${ours.id}…`);
  await api(`/${ours.id}`, { method: "PUT", body: JSON.stringify(payload) });
} else {
  console.log("Creating new hook…");
  await api("", { method: "POST", body: JSON.stringify(payload) });
}

console.log("✓ Webhook configured.");
