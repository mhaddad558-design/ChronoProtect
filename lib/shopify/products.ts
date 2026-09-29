import { storefront } from "./client";
import { GET_KIT_PRODUCTS, GET_PRODUCT_BY_HANDLE } from "./queries";

export interface Money {
  amount: string;
  currencyCode: string;
}

/** A photograph uploaded in the Shopify admin. */
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  image: ShopifyImage | null;
  selectedOptions: Array<{ name: string; value: string }>;
  price: Money;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  options: Array<{ name: string; optionValues: Array<{ name: string }> }>;
  priceRange: { minVariantPrice: Money };
  featuredImage: ShopifyImage | null;
  variants: { nodes: ProductVariant[] };
}

/** How long a product read stays cached before Next revalidates it. */
const PRODUCT_TTL_SECONDS = 300;

/**
 * Reads a product for a marketing page.
 *
 * Returns null instead of throwing when Shopify is unreachable or not yet
 * configured, so the site still renders before the store exists. Pages fall
 * back to a "pricing confirmed at checkout" line rather than a hardcoded price.
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await storefront<{ product: ShopifyProduct | null }>(
      GET_PRODUCT_BY_HANDLE,
      { handle },
      { revalidate: PRODUCT_TTL_SECONDS }
    );
    return data.product;
  } catch {
    return null;
  }
}

export interface KitProducts {
  chronoshield: ShopifyProduct | null;
  chronoguard: ShopifyProduct | null;
  installation: ShopifyProduct | null;
}

const EMPTY: KitProducts = { chronoshield: null, chronoguard: null, installation: null };

/** Reads all three products in one round trip. Same graceful-null contract. */
export async function getKitProducts(): Promise<KitProducts> {
  try {
    return await storefront<KitProducts>(
      GET_KIT_PRODUCTS,
      {},
      { revalidate: PRODUCT_TTL_SECONDS }
    );
  } catch {
    return EMPTY;
  }
}

export function formatMoney(money: Money | undefined | null): string | null {
  if (!money) return null;
  const amount = Number(money.amount);
  if (!Number.isFinite(amount)) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/**
 * The variant matching every option given. Options left undefined are
 * ignored, so ChronoGuard+ (Finish only) resolves with the same call.
 */
export function variantFor(
  product: ShopifyProduct | null,
  wanted: Record<string, string | undefined>
): ProductVariant | null {
  if (!product) return null;
  const required = Object.entries(wanted).filter(([, v]) => v != null) as Array<[string, string]>;
  return (
    product.variants.nodes.find((variant) =>
      required.every(([name, value]) =>
        variant.selectedOptions.some(
          (o) =>
            o.name.toLowerCase() === name.toLowerCase() &&
            o.value.toLowerCase() === value.toLowerCase()
        )
      )
    ) ?? null
  );
}

/** The lowest price across a product's variants, formatted, or null. */
export function startingPrice(product: ShopifyProduct | null): string | null {
  return formatMoney(product?.priceRange.minVariantPrice);
}
