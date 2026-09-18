# ChronoProtect+ × Shopify Storefront API

Headless setup: products and checkout live in Shopify, everything customers see lives in your Next.js app. Customers land on Shopify's hosted checkout only at the final step.

## What you need to do in Shopify

These steps need your account, so they're yours to run — I can't do them for you.

### 1. Plan

Basic or above. A headless build that reads products, manages a cart, and sends customers to Shopify's **standard** checkout works on Basic. You only need Plus if you later want to customize the checkout page itself.

### 2. Create three products

**Quickest path:** import `shopify/products-import.csv` (Products → Import). It
creates all three products and the four kit variants as drafts at £0.00, leaving
you to set prices and publish. See `shopify/README.md`. The rest of this section
describes what that import produces, and is what to follow if you create them by
hand instead.

| Product | Handle | Option "Finish" | Notes |
|---|---|---|---|
| ChronoShield+ | `chronoshield` | Gloss, Stealth | Whole-watch coverage |
| ChronoGuard+ | `chronoguard` | Gloss, Stealth | Case and clasp only |
| Professional Installation | `professional-installation` | none | Single variant, added as its own line |

The **product titles carry the plus, the handles do not.** Handles are
identifiers; the site looks products up by them and renaming would break the
lookup. Title the products `ChronoShield+` and `ChronoGuard+` in the admin so the
plus reaches order confirmations and packing slips — `cart.ts` writes the
Shopify product title into the `Coverage` line attribute, so whatever you type
there is what prints.

Four kit variants total. **Do not create a variant per reference number.** There are 64 references in the catalog; at two finishes each that's 128 combinations, and it would consume two of Shopify's three option slots for data that is really just an attribute. The reference travels as a cart line attribute instead — it prints on the order and packing slip, which is all the cutting operation needs.

Set each product's "Requires shipping" on, and inventory tracking off (or to a made-to-order policy) since kits are cut per order rather than stocked.

### 3. Generate a Storefront access token

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**
2. Create an app, e.g. "ChronoProtect+ Web"
3. **Configuration → Storefront API**, enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_product_inventory` (only if you want live stock counts)
4. **API credentials** → install the app → copy the **Storefront API access token**

That token is public by design and belongs in `NEXT_PUBLIC_*`. The Admin API token from the same screen is not — keep it out of this repo entirely.

### 4. Wire the env

```bash
cp .env.local.example .env.local
# paste the domain and token
```

## What's in this drop

```
lib/shopify/client.ts       GraphQL fetch wrapper, typed errors
lib/shopify/queries.ts      Product + cart documents
lib/shopify/cart.ts         Configurator answers → cart line → checkout URL
lib/fitment.ts              Reference lookup and type-ahead
data/fitment.json           All 64 references, exported from the design canvas
components/FindYourKit.tsx  The five-step configurator
components/find-your-kit.css  Brand tokens
```

Mount it:

```tsx
// app/find-your-kit/page.tsx
import FindYourKit from "@/components/FindYourKit";
import "@/components/find-your-kit.css";

export default function Page() {
  return <FindYourKit />;
}
```

## How the flow works

1. Customer enters a reference. `findFitment()` checks it against `fitment.json` and confirms the model inline.
2. Four more questions collect wear pattern, finish, coverage, and application.
3. `createKitCheckout()` resolves the right product + finish variant, attaches the reference and fitment context as line attributes, and creates a cart.
4. The browser redirects to `cart.checkoutUrl` — Shopify's hosted checkout, with your branding applied from the admin's checkout settings.

Studio installation is pushed as a **second line item** rather than folded into the kit, so it can be priced, taxed, and fulfilled separately.

## Things to know before launch

- **Checkout branding** lives in Shopify admin → Settings → Checkout. Match the bronze `#BC906C` and the deep forest ground so the handoff doesn't feel like leaving the site.
- **Customer accounts:** Shopify deprecated legacy customer accounts in February 2026 and is phasing out Multipass. If you add logins later, use the Customer Account API (OAuth 2.0 with PKCE) rather than the old flow.
- **Apps mostly won't work.** Most Shopify apps inject into Liquid themes and have no effect on a headless frontend. Check before you buy one.
- **Prices are still `[PRICE]` placeholders** on the design canvas. Real prices live in Shopify once the products exist; the canvas is just a mock.
- `fitment.json` is the single source of truth for references. When the studio approves new fitment, edit that file — the catalog page, configurator lookup, and type-ahead all read from it.

## Verify before shipping

- [ ] Both kit products resolve (`GET_KIT_PRODUCTS` returns non-null)
- [ ] Both finishes exist with exactly the option name `Finish`
- [ ] A test order shows the Reference attribute on the order detail
- [ ] Unknown reference (e.g. `999999`) still lets the customer proceed and routes them to the fit-guide email
- [ ] Checkout completes end to end in Shopify's test mode
