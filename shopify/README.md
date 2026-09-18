# Shopify import

`products-import.csv` creates the three products the storefront expects, with
the eight kit variants, in one upload.

| Product | Options | Variants |
|---|---|---|
| ChronoShield+ | `Finish` × `Bracelet` | 6 |
| ChronoGuard+ | `Finish` | 2 |
| Professional Installation | none | 1 |

## If you have already imported and set prices

**Re-importing this file with "Overwrite products with the same handle" ticked
will reset every price to 0.00.** Two safer routes:

- **Edit prices into the CSV first.** Open it, fill the `Variant Price` column
  with what you have already decided, then import with overwrite. Best if you
  want the SKUs and the six-variant grid in one shot.
- **Add the option by hand.** Only ChronoShield+ changed. In its admin page add
  a second option named `Bracelet` with the three values; Shopify will ask what
  to assign the existing Gloss and Stealth variants, then you price the four new
  rows. Leaves everything else untouched.

ChronoGuard+ and Professional Installation are unchanged — do not re-import them
at all if their prices are set.

## Import it

Shopify admin → **Products** → **Import** → upload `products-import.csv` →
**Upload and continue** → review the preview → **Import products**.

Do *not* tick "Overwrite products with the same handle" unless you intend to
replace existing ones.

## Then do these four things

The import deliberately leaves them to you.

1. **Set real prices.** Every variant imports at `0.00`. Prices live in Shopify
   and are never hardcoded in this repo, so the CSV cannot carry them.
2. **Publish.** Everything imports as `draft` with `Published` FALSE, so a
   mispriced product cannot go live by accident. Set each to Active and publish
   to the Online Store channel once priced.
3. **Check the option names.** Both kits need an option named exactly `Finish`
   with values `Gloss` and `Stealth`, and ChronoShield+ needs a second named
   exactly `Bracelet` with `Oyster`, `Jubilee`, `President`. `cart.ts` matches on
   those names case-insensitively; a different name means no variant resolves.
4. **Confirm the handles.** They must stay `chronoshield`, `chronoguard`, and
   `professional-installation` — the storefront looks products up by handle in
   `GET_KIT_PRODUCTS`. Shopify derives the handle from the title on create, and
   `ChronoShield+` would otherwise produce `chronoshield-1` or similar, so the
   CSV sets them explicitly. Check them after import.

## Choices the CSV makes

| Field | Value | Why |
|---|---|---|
| Title | `ChronoShield+`, `ChronoGuard+` | The plus is part of the brand, and `cart.ts` writes the product title into the `Coverage` line attribute, so this is what prints on orders |
| Handle | unsuffixed | Identifiers, not display names — see CLAUDE.md |
| Status | `draft` | Nothing ships at £0.00 by mistake |
| Inventory tracker | empty | Kits are cut per order, not stocked |
| Inventory policy | `continue` | Never block a sale on a stock count that is not kept |
| Requires shipping | TRUE for kits, **FALSE** for installation | A studio fitting is a service and has nothing to post. If you would rather it behaved like a shippable line, set it TRUE |
| Grams | 40 / 25 / 0 | Rough kit weights so shipping rates calculate; correct them to your actual packed weights |
| SKU | `CPS-*`, `CPG-*`, `CP-INSTALL` | So the cutting operation has a code per finish. Change freely, nothing in the site reads them |

## What this does not cover

Storefront API access. That is a separate step — see `SETUP.md`, section 3. The
Admin API token on that same screen must never enter this repo.
