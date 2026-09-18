/**
 * Derives `public/crest.svg` from the master brand artwork in `brand/`.
 *
 * The master is a 4MB Instagram export: an opaque 1080x1350 post background,
 * 19 embedded PNGs, and ~3,400 clip paths making up the halftone texture. The
 * crest itself is the only part drawn as real vector — four paths filled in the
 * brand bronze (#bc906c). This lifts out those four paths, keeps the clip rects
 * they depend on, crops the viewBox to the artwork, and drops everything else.
 *
 * The "Chrono PROTECT+" lettering inside the shield is raster in the master, so
 * it is deliberately left behind; the site sets the wordmark as live type.
 *
 * Run it when the master artwork changes:
 *   node scripts/extract-crest.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(here, "..", "brand", "ig-logo-source.svg");
const OUT = join(here, "..", "public", "crest.svg");
const BRONZE = "#bc906c";

const src = readFileSync(SOURCE, "utf8");

/** Walk the tag stream, tracking the open-element stack, to find bronze paths. */
function findCrestPaths() {
  const tagRe = /<(\/?)([a-zA-Z:]+)([^>]*?)(\/?)>/g;
  const stack = [];
  const out = [];
  let m;

  while ((m = tagRe.exec(src))) {
    const [, close, name, attrs, selfClose] = m;
    if (close) {
      stack.pop();
      continue;
    }

    if (name === "path") {
      const fill = (attrs.match(/fill="([^"]*)"/) || [])[1]?.toLowerCase();
      const d = (attrs.match(/\sd="([^"]*)"/) || [])[1] || "";
      // The two full-canvas rectangles are the post background, not the mark.
      const isCanvas = /^M 0\.1992\d* 0 L 809\.8/.test(d);
      if (fill === BRONZE && !isCanvas) {
        const ancestor = stack[stack.length - 1]?.attrs ?? "";
        const clipId = (ancestor.match(/clip-path="url\(#([^)]+)\)"/) || [])[1];
        out.push({ d, clipId });
      }
    }

    if (selfClose !== "/" && name !== "image" && name !== "stop") {
      stack.push({ name, attrs });
    }
  }
  return out;
}

/**
 * These clips are real crops, not bounding boxes — one is a 39x4 sliver that
 * hides construction geometry. Dropping them exposes an inner ring that is not
 * in the artwork, so they travel with the paths.
 */
function clipPathData(id) {
  const m = src.match(new RegExp(`<clipPath id="${id}"><path d="([^"]*)"`));
  if (!m) throw new Error(`clipPath ${id} not found in source`);
  return m[1];
}

/** 2dp is far below a pixel at this scale and roughly halves the file. */
function shrink(d) {
  return d
    .replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 100) / 100))
    .replace(/\s+/g, " ")
    .trim();
}

function extent(d) {
  const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) {
    minX = Math.min(minX, n[i]); maxX = Math.max(maxX, n[i]);
    minY = Math.min(minY, n[i + 1]); maxY = Math.max(maxY, n[i + 1]);
  }
  return { minX, minY, maxX, maxY };
}

const parts = findCrestPaths().map((p) => ({
  ...p,
  clipD: p.clipId ? clipPathData(p.clipId) : null,
}));

if (parts.length !== 4) {
  throw new Error(`expected 4 bronze paths in the master, found ${parts.length}`);
}

// Paths are absolute and untransformed, so raw coordinates give a safe superset
// box; intersecting with each clip rect tightens it to what actually renders.
let box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
for (const p of parts) {
  const a = extent(p.d);
  const c = p.clipD ? extent(p.clipD) : a;
  box = {
    minX: Math.min(box.minX, Math.max(a.minX, c.minX)),
    minY: Math.min(box.minY, Math.max(a.minY, c.minY)),
    maxX: Math.max(box.maxX, Math.min(a.maxX, c.maxX)),
    maxY: Math.max(box.maxY, Math.min(a.maxY, c.maxY)),
  };
}

const pad = 6;
const vb = [
  Math.floor(box.minX - pad),
  Math.floor(box.minY - pad),
  Math.ceil(box.maxX - box.minX + pad * 2),
  Math.ceil(box.maxY - box.minY + pad * 2),
].join(" ");

const defs = parts
  .map((p, i) => `<clipPath id="cp${i}"><path d="${shrink(p.clipD)}"/></clipPath>`)
  .join("");

const body = parts
  .map((p, i) => `<path clip-path="url(#cp${i})" d="${shrink(p.d)}"/>`)
  .join("\n  ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="${BRONZE}" fill-rule="nonzero">
  <title>ChronoProtect+</title>
  <defs>${defs}</defs>
  ${body}
</svg>
`;

writeFileSync(OUT, svg);
console.log(
  `crest.svg written: viewBox "${vb}", ${svg.length} bytes ` +
    `(source ${(src.length / 1e6).toFixed(2)}MB)`
);
