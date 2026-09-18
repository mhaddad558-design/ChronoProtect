import { storefront } from "./client";
import { GET_KIT_PRODUCTS, GET_PRODUCT_BY_HANDLE } from "./queries";

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
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

/** The lowest price across a product's variants, formatted, or null. */
export function startingPrice(product: ShopifyProduct | null): string | null {
  return formatMoney(product?.priceRange.minVariantPrice);
}
