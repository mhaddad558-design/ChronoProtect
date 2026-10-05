# Dealer card

A card that goes in the box when a dealer or service shop hands a watch over.
It reaches the buyer on the first day, before the first wear, which is the
moment the film is worth the most.

## Format

- US business card, 3.5 x 2 in, two sides, 16pt uncoated stock so it reads
  as a card rather than a flyer.
- Ground `#0B110D`. Crest in bronze `#BC906C`, text in white. The QR code
  is dark on a small white panel, since light-on-dark codes fail on some
  phone cameras. No gradients, no gloss laminate.
- Crest lockup (`components/Lockup.tsx`, "Chrono" over "PROTECT+") in Jost.
  Headlines in Red Hat Display light. Body and the reference label in Red
  Hat Text; the reference itself is handwritten on the line.
- Sentence case throughout. No Rolex name, crown or reference number is
  printed, so the card needs no disclaimer.

## Front

> [Crest lockup: Chrono / PROTECT+]
>
> The finish is only perfect once.

## Back

> ChronoShield+ covers the case, bezel, every link and the clasp.
> ChronoGuard+ covers the case and clasp. Both are cut to the reference and
> come off clean.
>
> Reference ______________
>
> [QR code] Scan for the kit cut to this watch.

The dealer writes the reference on the line at handover, so the buyer has it
in hand when the configurator asks for it.

## Pre-owned variant

For pre-owned dealers and service shops, where the watch is not new. The
back stays the same.

> [Crest lockup: Chrono / PROTECT+]
>
> Keep the finish it has today.

## Print files

In `marketing/dealer-card/`:

| File | What it is |
|---|---|
| `dealer-card-new.pdf` | New-watch card, front and back |
| `dealer-card-preowned.pdf` | Pre-owned card, front and back |
| `preview-*.png` | Screen previews, not for print |

Each PDF page is 3.75 x 2.25 in: the 3.5 x 2 in card plus 0.125 in bleed on
every side, with text kept a further 0.125 in inside the trim. Fonts are
embedded. Ask the printer whether they want text outlined.

## QR code

Points at the configurator, tagged so dealer sales can be counted:

```
https://www.chronoprotect.store/find-your-kit?utm_source=dealer&utm_medium=card&utm_campaign=<dealer-slug>
```

The current print files use the generic slug `dealer-card`, and the code was
checked to decode to that address. For per-dealer counts, make a run per
dealer with its own slug, lowercase with hyphens, for example
`smith-jewelers`. The back also prints `chronoprotect.store` for anyone who
does not scan.

A dealer with a label printer can go further and print a sticker QR per
watch with the reference added, `&ref=126610LN` for example. The
configurator reads `ref`, fills in the reference and skips to the next step.

## Open decisions

- **What the dealer gets.** A commission per sale, a wholesale price on
  studio installation, or nothing. The card works either way, but a dealer
  with a stake hands it over.
- **Buyer offer.** A discount code on the card would lift scans and lets
  sales be counted without the UTM tags. Prices come from Shopify, so any
  code is created there.
