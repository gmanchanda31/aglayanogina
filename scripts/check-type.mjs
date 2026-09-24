/**
 * Type-system guard. Every piece of text uses one of the six roles in
 * app/globals.css (type-title, type-heading, type-lead, type-body, type-ui,
 * type-meta) — one font, one size, one style: Inter 400, regular case.
 *
 * Fails if a component sets size, family, weight, tracking, line-height or
 * case directly, or reintroduces caps / a serif.
 *
 *   node scripts/check-type.mjs      (also runs as part of `pnpm lint`)
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["app", "components", "lib"];

const RULES = [
  [/\b(uppercase|capitalize)\b|text-transform|toUpperCase\(|toLocaleUpperCase\(/, "no caps — regular case only"],
  [/label-caps|title-page|title-section|serif-italic|\bserif\b|font-serif|font-\[family|vollkorn|georgia/i, "one family (Inter) — use a type-* role"],
  [/\btracking-/, "no letter-spacing utilities — the roles own tracking"],
  [/\btext-(xs|sm|base|lg|xl|[2-9]xl)\b|\btext-\[\d/, "no raw font sizes — use a type-* role"],
  [/\bfont-(thin|extralight|light|medium|semibold|bold|extrabold|black)\b|fontWeight:\s*[5-9]00/, "one weight (400) only"],
  [/\bitalic\b|fontStyle:\s*["']italic/, "one style — no italic"],
  [/\bleading-(?!none\b)/, "no raw line-heights — the roles own leading"],
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(tsx?|mdx)$/.test(name) ? [p] : [];
  });
}

const files = DIRS.flatMap((d) => walk(path.join(ROOT, d)));

const problems = [];
for (const file of files) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments may describe the rules
      for (const [re, msg] of RULES) {
        if (re.test(line)) problems.push(`${path.relative(ROOT, file)}:${i + 1}  ${msg}\n    ${line.trim()}`);
      }
    });
}

const css = readFileSync(path.join(ROOT, "app/globals.css"), "utf8");
if (/text-transform:\s*uppercase|--font-serif|vollkorn/i.test(css)) {
  problems.push("app/globals.css  caps or serif declared in the stylesheet");
}

if (problems.length) {
  console.error(`Type-system check failed (${problems.length}):\n\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`Type-system check passed (${files.length} files).`);
