/**
 * Checks the Shopify side against what the storefront actually needs.
 *
 * Reads .env.local directly and never prints the token — only whether it looks
 * well formed. Everything else it reports in full, because a product that is
 * draft, unpublished, misnamed, or missing a variant fails in exactly the same
 * way as a bad token, and the site cannot tell you which.
 *
 *   npm run verify:shopify
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(here, "..", ".env.local");

/** Expectations, mirroring lib/shopify/cart.ts and data/fitment.json. */
const EXPECTED = {
  chronoshield: { title: "ChronoShield+", options: { Finish: 2, Bracelet: 3 }, variants: 6 },
  chronoguard: { title: "ChronoGuard+", options: { Finish: 2 }, variants: 2 },
  installation: { title: "Professional Installation", options: {}, variants: 1 },
};
const FINISHES = ["Gloss", "Stealth"];
const BRACELETS = ["Oyster", "Jubilee", "President"];

function readEnv() {
  let raw;
  try {
    raw = readFileSync(ENV_PATH, "utf8");
  } catch {
    fail(`.env.local not found at ${ENV_PATH}\nCopy .env.local.example to .env.local and fill it in.`);
  }
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exitCode = 1;
  // Thrown rather than process.exit() so pending sockets close cleanly.
  throw new Error("verification stopped");
}

/**
 * Shopify prefixes its token types. The prefix is not secret and says exactly
 * which token was pasted, which is the difference between "wrong credential"
 * and "wrong product setup".
 */
const TOKEN_KINDS = {
  shpat_: "an Admin API access token",
  shpca_: "a custom app token",
  shppa_: "a private app password",
  shpss_: "an app shared secret",
};

function describeToken(value) {
  const prefix = Object.keys(TOKEN_KINDS).find((p) => value.startsWith(p));
  return prefix ? { prefix, what: TOKEN_KINDS[prefix] } : null;
}

const env = readEnv();
const domain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const version = env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2026-01";

console.log("— Credentials —");
if (!domain) fail("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is empty.");
if (!token) fail("NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN is empty.");

console.log(`  domain      ${domain}`);
console.log(`  api version ${version}`);
// Never print the token, only whether its shape is plausible.
console.log(`  token       ${token.length} chars, ${/^[a-f0-9]+$/i.test(token) ? "hex" : "non-hex"}`);

const problems = [];
if (/^https?:\/\//i.test(domain)) problems.push("Domain includes a protocol — drop the https://");
if (domain.endsWith("/")) problems.push("Domain has a trailing slash — remove it");
if (!domain.endsWith(".myshopify.com")) {
  problems.push(`Domain should be the .myshopify.com one, not a custom domain (got "${domain}")`);
}
const kind = describeToken(token);
if (kind) {
  problems.push(
    `The token starts with "${kind.prefix}", which makes it ${kind.what} — not a Storefront ` +
      `access token.\n     A Storefront token is ~32 hex characters with no prefix.\n` +
      `     Admin tokens must not be in this repo at all: delete it from .env.local.`
  );
} else if (!/^[a-f0-9]{32}$/i.test(token)) {
  problems.push(
    `The token is ${token.length} characters and not 32 hex — that is not the shape of a ` +
      `Storefront access token. Check you copied the right field.`
  );
}
if (problems.length) {
  console.error("");
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error("");
  process.exitCode = 1;
  throw new Error("verification stopped");
}

const QUERY = /* GraphQL */ `
  fragment P on Product {
    handle
    title
    status: availableForSale
    options { name optionValues { name } }
    variants(first: 50) {
      nodes {
        title
        availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
      }
    }
  }
  query Verify {
    chronoshield: product(handle: "chronoshield") { ...P }
    chronoguard: product(handle: "chronoguard") { ...P }
    installation: product(handle: "professional-installation") { ...P }
  }
`;

const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
  body: JSON.stringify({ query: QUERY }),
});

if (!res.ok) {
  const body = await res.text();
  if (res.status === 401 || res.status === 403) {
    fail(
      `Storefront API returned ${res.status}. The token is rejected.\n` +
        "Check you copied the Storefront API access token (not Admin), and that the app is installed."
    );
  }
  if (res.status === 404) {
    fail(`Storefront API returned 404. The domain or API version looks wrong.\n${body.slice(0, 300)}`);
  }
  fail(`Storefront API returned ${res.status}\n${body.slice(0, 500)}`);
}

const json = await res.json();
if (json.errors?.length) {
  fail("GraphQL errors:\n  " + json.errors.map((e) => e.message).join("\n  "));
}

console.log("\n— Products —");
let bad = 0;

for (const [key, expect] of Object.entries(EXPECTED)) {
  const p = json.data[key];
  const label = `${key} (${expect.title})`;

  if (!p) {
    console.error(`  ✗ ${label}: not found.`);
    console.error(
      "      Either the handle differs, or the product is draft / not published to this app's sales channel."
    );
    bad++;
    continue;
  }

  console.log(`  ✓ ${label} → handle "${p.handle}", ${p.variants.nodes.length} variant(s)`);

  for (const opt of p.options) {
    console.log(`      option "${opt.name}": ${opt.optionValues.map((v) => v.name).join(", ")}`);
  }

  // Option names are matched case-insensitively by cart.ts, but must exist.
  for (const [name, count] of Object.entries(expect.options)) {
    const found = p.options.find((o) => o.name.toLowerCase() === name.toLowerCase());
    if (!found) {
      console.error(`      ✗ missing option named "${name}"`);
      bad++;
    } else if (found.optionValues.length !== count) {
      console.error(
        `      ✗ option "${name}" has ${found.optionValues.length} values, expected ${count}`
      );
      bad++;
    }
  }

  if (p.variants.nodes.length !== expect.variants) {
    console.error(`      ✗ ${p.variants.nodes.length} variants, expected ${expect.variants}`);
    bad++;
  }

  const unpriced = p.variants.nodes.filter((v) => Number(v.price.amount) === 0);
  if (unpriced.length) {
    console.error(`      ✗ ${unpriced.length} variant(s) still priced at 0 — set real prices`);
    bad++;
  }

  const unavailable = p.variants.nodes.filter((v) => !v.availableForSale);
  if (unavailable.length === p.variants.nodes.length) {
    console.error(`      ✗ no variant is available for sale`);
    bad++;
  }
}

// The combination the configurator has to resolve for a ChronoShield+ order.
console.log("\n— Variant resolution —");
const shield = json.data.chronoshield;
if (shield) {
  for (const finish of FINISHES) {
    for (const bracelet of BRACELETS) {
      const hit = shield.variants.nodes.find(
        (v) =>
          v.selectedOptions.some(
            (o) => o.name.toLowerCase() === "finish" && o.value.toLowerCase() === finish.toLowerCase()
          ) &&
          v.selectedOptions.some(
            (o) =>
              o.name.toLowerCase() === "bracelet" && o.value.toLowerCase() === bracelet.toLowerCase()
          )
      );
      if (hit) {
        console.log(
          `  ✓ ${finish} / ${bracelet} → ${hit.price.amount} ${hit.price.currencyCode}` +
            (hit.availableForSale ? "" : "  (unavailable)")
        );
      } else {
        console.error(`  ✗ ${finish} / ${bracelet} → no variant`);
        bad++;
      }
    }
  }
}

const guard = json.data.chronoguard;
if (guard) {
  for (const finish of FINISHES) {
    const hit = guard.variants.nodes.find((v) =>
      v.selectedOptions.some(
        (o) => o.name.toLowerCase() === "finish" && o.value.toLowerCase() === finish.toLowerCase()
      )
    );
    if (hit) {
      console.log(`  ✓ ChronoGuard+ ${finish} → ${hit.price.amount} ${hit.price.currencyCode}`);
    } else {
      console.error(`  ✗ ChronoGuard+ ${finish} → no variant`);
      bad++;
    }
  }
}

console.log("");
if (bad) {
  console.error(`✗ ${bad} problem(s) found. The site will not check out correctly until these are fixed.\n`);
  process.exit(1);
}
console.log("✓ Shopify is wired up correctly.\n");
