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
> Fitted before the first wear.

## Back

> ChronoShield+ covers the case, bezel, every link and the clasp.
> ChronoGuard+ covers the case and clasp. Both are cut to the reference,
> fitted here in the store, and come off clean.
>
> Reference ______________
> Fitting ______________
>
> [QR code] Scan for care and removal.

The store fits the film, at collection or by appointment the next day. The
team writes the reference and the fitting appointment on the lines, so the
card doubles as the appointment card. Once fitted, the code takes the owner
to care and removal.

## Pre-owned variant

For pre-owned dealers and service shops. The back stays the same.

> [Crest lockup: Chrono / PROTECT+]
>
> Fitted here, the day you collect it.

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

Points at care and removal on the installation page, tagged so card scans
can be counted:

```
https://www.chronoprotect.store/installation?utm_source=dealer-card#care
```

The code was checked to decode to that address. The back also prints
`chronoprotect.store` for anyone who does not scan.

For a card partner, a shop that sells through the card rather than fitting,
make a run whose code points at the configurator with the shop's own slug
instead:
`https://www.chronoprotect.store/find-your-kit?utm_source=dealer&utm_medium=card&utm_campaign=<shop-slug>`.

## Open decisions

- **What the dealer gets.** Settled in `retail-outreach.md`: stocking shops
  earn the retail margin and set their own fitting fee; card partners earn a
  commission.
- **Buyer offer.** A discount code on the card would lift scans and lets
  sales be counted without the UTM tags. Prices come from Shopify, so any
  code is created there.
