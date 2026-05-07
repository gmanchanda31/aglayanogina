import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { imageSize } from "image-size";

const path = "./data/image_plan.json";
const plan = JSON.parse(readFileSync(path, "utf8"));

let measured = 0, skipped = 0, failed = 0;

for (const key of Object.keys(plan)) {
  const entries = plan[key];
  for (const entry of entries) {
    if (entry.width && entry.height) { skipped++; continue; }
    try {
      const buf = readFileSync(join("./public", entry.local));
      const dim = imageSize(buf);
      entry.width = dim.width;
      entry.height = dim.height;
      measured++;
    } catch (e) {
      failed++;
      console.warn(`  fail: ${entry.local} (${e.message})`);
    }
  }
}

writeFileSync(path, JSON.stringify(plan, null, 2));
console.log(`Measured ${measured}, skipped ${skipped} (already had dims), failed ${failed}`);
