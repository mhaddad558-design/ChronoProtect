# ChronoProtect+

Precision-cut protective film for collectible luxury watches. Two product lines:

- **ChronoShield+** — whole-watch coverage: case, bezel, full bracelet, clasp
- **ChronoGuard+** — case and clasp only, no bracelet coverage

Brand line: protect the piece, change the presence.

## The plus

The plus is part of the name, on the master brand and on both lines. It belongs
in every customer-facing string: wordmark, nav, headings, configurator, catalog,
page titles.

It is **not** part of any identifier. Shopify handles (`chronoshield`,
`chronoguard`, `professional-installation`), route segments (`/kits/chronoshield`)
and the `coverage` keys in `fitment.json` stay unsuffixed — renaming them breaks
product lookup until the Shopify admin matches, for no customer benefit.

Where the plus enters a URL or a mailto subject, encode it as `%2B`. A bare `+`
in a query string decodes as a space.

Each line has a badge lockup — the crest with "Chrono" over the line word
(`PROTECT+`, `SHIELD+`, `GUARD+`). See `components/Lockup.tsx`.

## Brand tokens

Never substitute these. They come from the crest logo.

```
--cp-bg-deep:   #0B110D   deep forest-charcoal ground
--cp-bg-mid:    #141F19   section bands
--cp-bg-panel:  #182821   cards, inputs
--cp-bronze:    #BC906C   primary accent, CTAs, the crest itself
--cp-sage:      #7A9483   secondary accent, eyebrows, status dots
--cp-ink:       #FFFFFF
--cp-border:    rgba(188,144,108,0.22)
```

Type: **Red Hat Display** headings (light 300, wordmark 400); **Red Hat Text** for body, labels, nav and buttons; **DM Mono** only for reference numbers; **Jost** only inside the crest lockups, because it matches the logo lettering. Everything is sentence case: no uppercase labels, buttons or nav. Don't add a label above a heading unless it says something the heading doesn't, and separate details with commas, not middle dots or spaced dashes. The set was chosen to avoid the fonts every luxury template uses (Cormorant, Montserrat, Playfair); don't drift back to them.

The look is quiet luxury — dark ground, restrained bronze, generous space. No gradient washes, no drop shadows on cards, no accent-colored single words inside headlines.

Depth comes from the brand's own material, not effects: the watch coverage drawing (`components/WatchDiagram.tsx`), the crest's halftone as texture, the finish samples, the bracelet-link diagrams, and the reference numbers themselves. Layer with the three forest tones and hairlines. Spend the boldness on the watch drawing and keep everything else quiet. These styles live in `app/depth.css`.

## Product model (important)

Shopify holds **two kit products plus an installation product**.

- **ChronoShield+** has two options: `Finish` (Gloss / Stealth) and `Bracelet`
  (Oyster / Jubilee / President). Six variants. The film runs over every link,
  so the bracelet changes the template and the price — it has to be a variant,
  because price lives on the variant and a line attribute cannot carry one.
- **ChronoGuard+** has one option: `Finish`. Two variants. It stops at the clasp,
  so the bracelet changes nothing about what is cut or charged.

Eight kit variants total. Two of Shopify's three option slots are now spoken for
on ChronoShield+, which is the reason the reference must stay an attribute.

The **reference number is a cart line attribute, never a variant.** The catalog has 64 references; making them variants would blow past Shopify's three-option limit and produce 192 SKUs for no gain. Attributes print on the order, which is all the cutting operation needs.

Do not refactor toward reference-as-variant.

## Data

`data/fitment.json` is the single source of truth for supported references. Seven families:

- Datejust 36 and Datejust 41 store **reference prefixes** (`1263-`) and match on leading digits, because Rolex appends dial and bezel digits per configuration.
- Every other family stores **complete references** and matches exactly.

Rows are split by a property that changes the template, not by date alone: Submariner splits 40mm (pre-2020) vs 41mm (2020+); Daytona splits engraved/gem-set bezel vs Cerachrom bezel.

## Conventions

- Storefront API only. An Admin API token must never appear in this repo.
- Prices come from Shopify, never hardcoded.
- Checkout is Shopify-hosted; do not build a custom checkout (it needs Plus).
- Copy uses sentence case, active voice, no exclamation marks.
