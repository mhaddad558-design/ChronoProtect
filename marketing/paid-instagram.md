# Paid Instagram

How the ads are targeted, what runs in each ad set, and what has to be in
place first. Organic posts from `instagram-schedule.md` do the testing; paid
spend goes behind what already works.

## Before the first ad

These are blockers. Without them the ads cannot optimize for sales or
retarget anyone.

1. **Meta pixel on the site.** Built in: set `NEXT_PUBLIC_META_PIXEL_ID` in
   the host's environment to the pixel ID from Events Manager and redeploy.
   The storefront sends `PageView` on every page, `ViewContent` on
   `/kits/*`, and `AddToCart` with the cart value when the configurator
   hands over to checkout.
2. **Checkout events from Shopify.** Checkout is Shopify-hosted, so
   `InitiateCheckout` and `Purchase` come from Shopify's Facebook and
   Instagram sales channel, connected to the same pixel. The storefront does
   not send them itself, so nothing is counted twice.
3. **Domain verified** in Meta Business Manager, and `Purchase` set as the
   top-priority event.
4. **A business Instagram account** linked to the ad account.

## Audiences

Shipping is United States only, so every ad set is US only.

### 1. New Rolex owners, prospecting

The main audience: people who have just bought, or are about to buy, a
Rolex.

- **Age:** 28 to 65.
- **Interests (stacked, any of):** Rolex, Rolex Submariner, Rolex
  Datejust, Rolex Daytona, Rolex GMT-Master II, Watches and Wonders,
  Hodinkee, WatchBox, Chrono24, luxury watches.
- **Narrowed by (must also match):** engaged shoppers, or high-value goods
  shoppers where Meta offers it.
- **Creative:** Day one posts (S6) and reference-support posts.
- **Landing page:** `/find-your-kit?model=submariner`, `gmt`, `daytona` or
  `datejust`, matched to the model in the ad, so the configurator opens on
  that watch.

Meta treats interests as suggestions under Advantage+ audience. Run this ad
set with Advantage+ audience off first, so the results say whether the
interests work, then test it on.

### 2. Collectors, prospecting

Owners of several watches, who protect what they keep.

- **Age:** 35 to 65.
- **Interests:** watch collecting, horology, Patek Philippe, Audemars
  Piguet, Omega, Chrono24, Hodinkee.
- **Creative:** the collection (S3) and the long game (S5).
- **Landing page:** `/catalog`, so the whole range is visible.

### 3. The car and the watch

Supercar owners and fans who also wear watches, from the content guide's
car allusion.

- **Age:** 30 to 65.
- **Interests (any of) Ferrari, Lamborghini, Porsche, McLaren, paint
  protection film, AND (must also match) Rolex or luxury watches.**
  Targeting by car-brand interest is fine; the ads themselves never name or
  show Ferrari.
- **Creative:** the car and the watch (S1), and the car world carousels.
- **Other worlds:** once a world carousel has proven itself organically,
  test it as its own ad set with that world's interests (yachting, private
  aviation, polo, golf, wine collecting, art collecting, bespoke tailoring),
  AND Rolex or luxury watches, landing on `/kits/chronoshield`.
- **Landing page:** `/kits/chronoshield`.

### 4. Retargeting

Once the pixel has 30 days of data.

- **Site visitors, last 30 days, who did not buy.** Exclude purchasers from
  the last 180 days. Creative: reference-support posts and Gloss vs Stealth.
- **Configurator abandoners:** `AddToCart` or `InitiateCheckout` in the
  last 14 days, no `Purchase`. Creative: the fit (S4), the studio
  installation option, and the cut-to-order note ("Cut to order in 2 to 4
  business days").
- **Instagram engagers:** anyone who engaged with the account, or watched
  50% of a Reel, in the last 60 days.

### 5. Lookalikes

Once there are about 100 purchases.

- 1% lookalike of purchasers, US.
- 1% lookalike of configurator users (`InitiateCheckout`).
- These replace interest audiences 1 and 2 when they perform better.

## What runs

- **Promote proven posts, not new ones.** An organic Reel or carousel goes
  into ads once it has beaten the account's average reach and saves in its
  first 72 hours. Run it as a partnership-style ad from the ChronoProtect+
  account so the likes and comments stay on the post.
- **Reels placement first.** Instagram Reels and Stories, 9:16. Carousels go
  to feed at 4:5.
- **Captions** follow `BRAND-VOICE.md`. Ads do not name Rolex; a watch's
  model can be named only in a reference-support ad, which carries the Rolex
  disclaimer. The call to action is "Shop now" to the configurator.
- **AI label on.** Most creative is generated.

## Budget

Suggested starting point; the amount is a business decision.

- Start with ad sets 1 and 3 only, the same daily budget each, for 7 days,
  without edits, so Meta can leave its learning phase.
- Add retargeting (4) as soon as the pixel has data. It usually returns the
  most per dollar and needs the least.
- Move budget toward whichever ad set has the lowest cost per
  `InitiateCheckout` until purchases are frequent enough to judge on
  `Purchase` alone.
- Raise a winning ad set's budget by no more than 20% every 3 days, so it
  does not reset learning.

## Measure

| Metric | What it tells you |
|---|---|
| Cost per `InitiateCheckout` | Early signal, before purchases are frequent |
| Cost per purchase and return on ad spend | The real test, once purchases arrive |
| Hook rate (3-second views / impressions) | Whether the first frame stops the scroll |
| Hold rate (full plays / 3-second views) | Whether the Reel earns its 5 seconds |
| Configurator completion | Whether the landing page is doing its part |

Organic results feed back in: a Reel with a strong hook rate in ads is a
sign to make more of that storyline.
