# ChronoProtect+

Headless storefront for ChronoProtect+: precision-cut protective film for collectible luxury
watches. Next.js App Router in front, Shopify Storefront API behind, Shopify-hosted checkout at
the last step.

Brand rules and the product model live in [CLAUDE.md](CLAUDE.md). The Shopify side — what to
create in the admin and how to get a token — lives in [SETUP.md](SETUP.md).

## Running it

Node 18.18 or newer is required (Next 15). If `node --version` does not answer, install it first
from <https://nodejs.org>.

```bash
npm install
npm run dev
```

The site comes up on <http://localhost:3000>. It renders without Shopify configured — product
pages simply show "Pricing confirmed at checkout" instead of a price, and the configurator reports
a clear error at the final step. To wire the store up:

```bash
cp .env.local.example .env.local
# paste the domain and storefront token, then restart the dev server
```

## Pages

| Route | What it is |
|---|---|
| `/` | Home — the two lines, how it works, finishes, fitment |
| `/kits` | The two lines side by side |
| `/kits/chronoshield` | ChronoShield+ — whole-watch coverage: case, bezel, bracelet, clasp |
| `/kits/chronoguard` | ChronoGuard+ — case and clasp coverage |
| `/find-your-kit` | The five-step configurator, from the drop |
| `/catalog` | Searchable fitment catalog, read from `data/fitment.json` |
| `/installation` | Self-application, studio installation, care and removal |

## The logo

`brand/ig-logo-source.svg` is the master artwork, as supplied. It is an
Instagram export — 4MB of opaque post background, 19 embedded PNGs, and roughly
3,400 clip paths of halftone texture — so it is kept as reference and **never
served**.

`public/crest.svg` is the crown-and-shield mark lifted out of it: the four
vector paths the crest is actually drawn with, in the brand bronze, cropped and
transparent. Same artwork, 4.8KB instead of 4MB. It is used in the header, the
footer, and the favicon.

Regenerate it after the master changes:

```bash
npm run crest
```

The "Chrono PROTECT+" lettering inside the shield is raster in the master, so
the extraction leaves it behind and the site sets the wordmark as live type in
Bodoni Moda — sharper, selectable, and translatable.

### Badge lockups

[`components/Lockup.tsx`](components/Lockup.tsx) composes the per-line badge —
the crest with "Chrono" over the line word — from `crest.svg` plus live text, in
the crest's own coordinate space. One component covers all three marks:

| Mark | Where it appears |
|---|---|
| `PROTECT+` | Home hero |
| `SHIELD+` | `/kits`, `/kits/chronoshield` |
| `GUARD+` | `/kits`, `/kits/chronoguard` |

Composing beats shipping three flat images: the crest is already cached, the
type stays sharp at any size and inherits the brand tokens, and a fourth line
costs one more call. The halftone texture inside the shield is a tiled dot
pattern behind a radial fade rather than the master's ~1,100 placed dots.

## Layout

```
app/
  layout.tsx              Shell: fonts, header, footer, metadata
  globals.css             Brand tokens and site chrome
  icon.svg                Favicon, generated from the crest
  page.tsx                Home
  kits/page.tsx           The two lines
  kits/[handle]/page.tsx  One kit, statically generated for both handles
  find-your-kit/page.tsx  Mounts the configurator
  catalog/page.tsx        Fitment catalog
  installation/page.tsx   Application and care
components/
  SiteHeader.tsx          Sticky nav, with a disclosure menu under 60rem
  SiteFooter.tsx          Footer
  Crest.tsx               Renders public/crest.svg at a given height
  Price.tsx               Shopify price, or a neutral line when unconfigured
  FitmentCatalog.tsx      Client-side search over the fitment data
  FindYourKit.tsx         The configurator (from the drop)
  find-your-kit.css       Configurator styles (from the drop)
lib/
  site.ts                 Shared copy and constants — no prices
  fitment.ts              Reference lookup and type-ahead (from the drop)
  shopify/client.ts       Storefront GraphQL wrapper (from the drop)
  shopify/queries.ts      Product and cart documents (from the drop)
  shopify/cart.ts         Configurator answers to checkout URL (from the drop)
  shopify/products.ts     Server-side product reads for the marketing pages
data/
  fitment.json            Single source of truth for supported references
brand/
  ig-logo-source.svg      Master artwork, reference only, not served
scripts/
  extract-crest.mjs       Derives public/crest.svg from the master
```

## House rules worth repeating

- **Prices are never hardcoded.** They come from Shopify, and when Shopify has not answered the
  page says so rather than inventing a number.
- **Reference numbers are cart line attributes, not variants.** The only variant option is
  `Finish` (Gloss / Stealth), plus `Bracelet` on ChronoShield+ because the film
  runs over every link and the price follows the bracelet. See CLAUDE.md for why.
- **Storefront API only.** No Admin API token belongs in this repo.
- Adding fitment means editing `data/fitment.json`. The catalog page, the configurator lookup, and
  the type-ahead all read from it.

## Before shipping

The launch checklist is at the end of [SETUP.md](SETUP.md).
