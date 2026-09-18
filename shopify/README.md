# Shopify import

`products-import.csv` creates the three products the storefront expects, with
the four kit variants, in one upload.

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
3. **Check the Finish option.** Both kits must end up with one option named
   exactly `Finish`, values `Gloss` and `Stealth`. `cart.ts` matches on
   that name case-insensitively; a different name means no variant resolves.
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
