import { chromium } from "playwright";

const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/projects/archipelago",
  "/projects/lost-beauty",
  "/projects/nest",
  "/projects/terra-memoria-mundi",
  "/projects/archipelago-book",
  "/projects/archive-of-dreams",
  "/projects/ceramic",
  "/projects/invisibility",
  "/exhibitions",
  "/exhibitions/lost-beauty",
  "/exhibitions/landscapes-of-memory",
  "/illustrations",
  "/illustrations/the-eustomes",
  "/photographs",
  "/photographs/colour",
  "/photographs/b-w",
  "/writings",
  "/writings/afterlife",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const allOffenders = [];

for (const route of ROUTES) {
  try {
    await page.goto(`http://localhost:3331${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  } catch {
    console.log(`✗ ${route} (failed to load)`);
    continue;
  }

  const offenders = await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll("img"));
    for (let i = 0; i < 30; i++) {
      if (imgs.every((img) => img.complete && img.naturalWidth > 0)) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    const out = [];
    for (const img of imgs) {
      if (!img.naturalWidth) continue;
      const r = img.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const fit = getComputedStyle(img).objectFit;
      if (fit !== "cover") continue;
      const natRatio = img.naturalWidth / img.naturalHeight;
      const dispRatio = r.width / r.height;
      const diff = Math.abs(natRatio - dispRatio) / Math.max(natRatio, dispRatio);
      if (diff > 0.1) {
        out.push({
          alt: (img.alt || "").slice(0, 40),
          cropPct: Math.round(diff * 100),
        });
      }
    }
    return out;
  });

  if (offenders.length === 0) {
    console.log(`✓ ${route}`);
  } else {
    console.log(`✗ ${route} — ${offenders.length} cropped:`);
    for (const o of offenders) console.log(`    ${o.cropPct}%  ${o.alt}`);
    allOffenders.push({ route, offenders });
  }
}

await browser.close();
console.log(`\nTotal: ${allOffenders.length} routes with cropped images.`);
