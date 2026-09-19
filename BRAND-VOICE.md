# ChronoProtect+ voice

How the site is written, so anything added elsewhere — Shopify product
descriptions, checkout text, emails, packaging inserts — reads as the same
company. Examples are taken from the live site.

## The three rules from CLAUDE.md

Sentence case. Active voice. No exclamation marks.

Everything below follows from those.

## Headlines are sentences, and they end in a full stop

Not labels. A complete thought, punctuated.

> A watch you wear should not be a watch you worry about.
> Same film, different reach.
> It comes off the way it went on.
> Cut to the bracelet, link by link.

Not: `PREMIUM WATCH PROTECTION` · `Ultimate Protection Solutions` · `Our Products`

Sentence case means only the first word and proper nouns are capitalised.
Never title case, never all caps, in a headline.

## Be specific instead of superlative

The product is described by what it physically does. Adjectives that could
apply to any product are the thing to cut.

> Every link is cut individually, so the bracelet keeps its articulation and
> the film disappears into the brushing.

Not: "premium quality materials for the ultimate protection."

If a sentence would survive being moved to a competitor's site, rewrite it.

**Prefer a number to an intensifier.** "64 references", "an hour at the kitchen
table", "every year or two". Not "a huge range", "quick and easy", "regularly".

## Say what it does not do

Limits are stated plainly and early. It reads as confidence, and it stops
returns.

> Case and clasp only.
> No bracelet coverage.
> Bracelet links are left bare.
> This reference is on Oysterflex, which ChronoShield+ does not cover.

## The watch is the subject, not the customer

Write about the object. Reach for "you" only when giving an instruction.

> The case keeps its lines, the bracelet keeps its brushing, and the piece
> keeps its value.

Not: "You'll love how your watch looks."

Instructions are the exception, and there the imperative is right: "Wipe every
surface with the supplied alcohol pad."

## Sentence shape

Short declaratives. One idea each. Vary the length — a long sentence carrying
detail, then a short one landing it.

> Kits arrive pre-cut, so the work is placement and patience rather than
> trimming. If you would rather not do it over your own watch, a studio
> partner will.

An em dash — like this — carries an aside inside a sentence. A colon introduces a
consequence. Semicolons are rare.

In short labels and lists of details, use commas: "Submariner, 2020–present,
41mm". Not middle dots ("A · B") and not a word joined to a fragment by a
dash ("Oyster — from your reference").

## Words to avoid

| Avoid | Because |
|---|---|
| ultimate, premium, revolutionary, unrivalled, cutting-edge | Says nothing, and every competitor says it |
| solutions, offerings, products | Say what the thing is: kit, film, template |
| simply, just, easy, effortless | Decides for the reader how hard it is |
| Don't, won't, can't | Contractions are fine in instructions, but the marketing copy stays uncontracted |
| ! | Never |

## Naming

**ChronoProtect+**, **ChronoShield+**, **ChronoGuard+** — the plus is part of
the name, always. Never ChronoShield on its own in customer-facing text.

Lowercase `chronoshield` appears only as a Shopify handle, a URL segment, or a
key in `fitment.json`. It is an identifier and never shown to a customer.

Rolex terms use Rolex's own names: **Oyster**, **Jubilee**, **President**,
**Oysterflex**, **Cerachrom**. Reference numbers are uppercase with no spaces —
`126610LN`, not `126610 LN`.

Finishes are capitalised as option values: **Gloss**, **Stealth**.

## The disclaimer travels with the brand

Wherever reference numbers appear — including Shopify product pages and order
confirmations:

> Not affiliated with, endorsed by, or sponsored by Rolex SA. Reference numbers
> are used only to describe fitment.

## Typography, where you can control it

| Role | Font | Why |
|---|---|---|
| Headings | Red Hat Display, light (300) | Modern and sleek: tight and clean, with slightly negative letter-spacing. The wordmark uses 400 |
| Body, labels, nav, buttons | Red Hat Text | The text cut of the heading family, so the two sit together without competing |
| Reference numbers only | DM Mono | The one thing on the site read as a code. The slashed zero keeps `0` and `O` apart |
| Crest lockups only | Jost | Matches the lettering in the logo artwork |

All four are on Google Fonts. Shopify's checkout branding offers its own fixed
font list rather than any Google Font, so there, pick the closest match: a
clean sans for headings and a plain sans for body.

Nothing is set in capitals: not labels, not buttons, not nav. The only capitals are
reference numbers, which appear exactly as Rolex writes them.

## Colour, where you can control it

```
--cp-bg-deep   #0B110D   ground
--cp-bg-mid    #141F19   section bands
--cp-bg-panel  #182821   cards, inputs
--cp-bronze    #BC906C   accent, CTAs, the crest
--cp-sage      #7A9483   eyebrows, status, secondary text
--cp-ink       #FFFFFF
```

Set the Shopify checkout to `#BC906C` on `#0B110D` so the handoff does not feel
like leaving the site.

No gradient washes. No drop shadows on cards. No accent-coloured single words
inside a headline — if a word needs emphasis, rewrite the sentence.

## One inconsistency to settle

The site currently mixes British and American spelling: `centre` appears 3
times, `colour`/`color` are split 4 and 5. Pick one and apply it everywhere,
including the Shopify copy. American is the safer default given prices are in
USD — which would mean `center`, `color`, and keeping `catalog`, already used
46 times.
