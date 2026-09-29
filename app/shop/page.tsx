import type { Metadata } from "next";
import Link from "next/link";
import Price from "@/components/Price";
import ProductPhoto from "@/components/ProductPhoto";
import {
  formatMoney,
  getKitProducts,
  variantFor,
  type ShopifyProduct,
} from "@/lib/shopify/products";
import { BRACELETS, DISPATCH, FINISHES, KIT_COPY, SHIPPING } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop all kits",
  description:
    "Every ChronoProtect+ kit in one place: ChronoShield+ in each finish and bracelet, and ChronoGuard+ in each finish.",
};

type Line = keyof typeof KIT_COPY;

interface Kit {
  line: Line;
  finish: string;
  /** ChronoShield+ only: the film runs over every link, so it is cut per bracelet. */
  bracelet?: string;
}

/**
 * Every kit, from the product model rather than from Shopify, so the grid is
 * complete even before the store is connected. Shopify then supplies each
 * kit's price and photograph.
 */
const KITS: Record<Line, Kit[]> = {
  chronoshield: FINISHES.flatMap((f) =>
    BRACELETS.map((b) => ({ line: "chronoshield" as const, finish: f.name, bracelet: b.name }))
  ),
  chronoguard: FINISHES.map((f) => ({ line: "chronoguard" as const, finish: f.name })),
};

function kitHref(kit: Kit): string {
  const params = new URLSearchParams({ coverage: kit.line, finish: kit.finish });
  if (kit.bracelet) params.set("bracelet", kit.bracelet);
  return `/find-your-kit?${params.toString()}`;
}

function KitCard({ kit, product }: { kit: Kit; product: ShopifyProduct | null }) {
  const copy = KIT_COPY[kit.line];
  const variant = variantFor(product, { Finish: kit.finish, Bracelet: kit.bracelet });
  const options = [kit.finish, kit.bracelet].filter(Boolean).join(", ");
  const name = `${copy.title}, ${options}`;
  const soldOut = variant ? !variant.availableForSale : false;

  return (
    <article className="cp-card cp-shop__card">
      <ProductPhoto
        image={variant?.image ?? product?.featuredImage}
        alt={name}
      />
      <h3>{copy.title}</h3>
      <p>{options}</p>
      <div className="cp-shop__foot">
        <Price value={formatMoney(variant?.price)} />
        <p className="cp-shipping" style={{ margin: 0 }}>
          {SHIPPING.line[kit.line]} {DISPATCH}
        </p>
        {soldOut ? (
          <span className="cp-btn cp-btn--ghost" aria-disabled="true">
            Sold out
          </span>
        ) : (
          <Link href={kitHref(kit)} className="cp-btn">
            Choose this kit
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function ShopPage() {
  const products = await getKitProducts();

  return (
    <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem)" }}>
      <div className="cp-measure">
        <p className="cp-eyebrow">Shop all</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>Every kit, in one place.</h1>
        <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
          Eight kits across two lines. Choose one here and the kit finder asks only which watch
          it is for, then cuts it to that reference.
        </p>
      </div>

      {(Object.keys(KITS) as Line[]).map((line) => (
        <div className="cp-shop__group" key={line} style={{ marginTop: "3.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>{KIT_COPY[line].title}</h2>
          <p className="cp-lede" style={{ marginTop: "0.75rem" }}>
            {KIT_COPY[line].coverage}.{" "}
            <Link href={`/kits/${line}`}>What it covers</Link>
          </p>
          <div className="cp-grid cp-grid--3">
            {KITS[line].map((kit) => (
              <KitCard kit={kit} product={products[line]} key={`${kit.finish}-${kit.bracelet ?? ""}`} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
