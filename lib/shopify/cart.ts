import { storefront, ShopifyError } from "./client";
import { GET_KIT_PRODUCTS, CART_CREATE, GET_CART } from "./queries";

export type Coverage = "chronoshield" | "chronoguard";
export type Finish = "Gloss" | "Matte" | "Stealth";
export type Application = "self" | "professional";

/** The five answers the Find Your Kit configurator collects. */
export interface KitSelection {
  reference: string;
  model?: string;
  usage?: string;
  finish: Finish;
  coverage: Coverage;
  application: Application;
}

interface Variant {
  id: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  variants: { nodes: Variant[] };
}

interface KitProductsData {
  chronoshield: Product | null;
  chronoguard: Product | null;
  installation: Product | null;
}

interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}

const CART_ID_KEY = "chronoprotect:cartId";

function findVariantByFinish(product: Product, finish: Finish): Variant | undefined {
  return product.variants.nodes.find((v) =>
    v.selectedOptions.some(
      (o) => o.name.toLowerCase() === "finish" && o.value.toLowerCase() === finish.toLowerCase()
    )
  );
}

/**
 * Turns a completed configurator selection into a Shopify cart and returns the
 * hosted checkout URL.
 *
 * The reference number and the rest of the fitment context ride along as line
 * attributes, so they print on the order and tell the studio which template to cut.
 */
export async function createKitCheckout(selection: KitSelection): Promise<string> {
  const data = await storefront<KitProductsData>(GET_KIT_PRODUCTS, {}, { cache: "no-store" });

  const product = data[selection.coverage];
  if (!product) {
    throw new ShopifyError(
      `No Shopify product found for handle "${selection.coverage}". Create it in the Shopify admin.`
    );
  }

  const variant = findVariantByFinish(product, selection.finish);
  if (!variant) {
    throw new ShopifyError(
      `${product.title} has no "${selection.finish}" finish variant. Check the Finish option values in Shopify.`
    );
  }
  if (!variant.availableForSale) {
    throw new ShopifyError(`${product.title} in ${selection.finish} is currently unavailable.`);
  }

  const attributes = [
    { key: "Reference", value: selection.reference.toUpperCase() },
    selection.model ? { key: "Model", value: selection.model } : null,
    { key: "Coverage", value: product.title },
    {
      key: "Application",
      value: selection.application === "professional" ? "Studio installation" : "Self-applied",
    },
    selection.usage ? { key: "Wear pattern", value: selection.usage } : null,
  ].filter(Boolean) as Array<{ key: string; value: string }>;

  const lines: Array<{
    merchandiseId: string;
    quantity: number;
    attributes: Array<{ key: string; value: string }>;
  }> = [{ merchandiseId: variant.id, quantity: 1, attributes }];

  // Studio installation is a separate line item so it can be priced and
  // fulfilled independently of the film kit itself.
  if (selection.application === "professional" && data.installation) {
    const installVariant = data.installation.variants.nodes[0];
    if (installVariant?.availableForSale) {
      lines.push({
        merchandiseId: installVariant.id,
        quantity: 1,
        attributes: [
          { key: "Reference", value: selection.reference.toUpperCase() },
          { key: "For", value: product.title },
        ],
      });
    }
  }

  const result = await storefront<{
    cartCreate: { cart: Cart | null; userErrors: Array<{ message: string }> };
  }>(
    CART_CREATE,
    {
      input: {
        lines,
        attributes: [{ key: "source", value: "find-your-kit" }],
      },
    },
    { cache: "no-store" }
  );

  const errors = result.cartCreate.userErrors;
  if (errors?.length) {
    throw new ShopifyError(errors.map((e) => e.message).join("; "));
  }
  const cart = result.cartCreate.cart;
  if (!cart) {
    throw new ShopifyError("Shopify did not return a cart.");
  }

  rememberCart(cart.id);
  return cart.checkoutUrl;
}

/* ---------- cart persistence (browser only) ---------- */

export function rememberCart(cartId: string): void {
  try {
    window.localStorage.setItem(CART_ID_KEY, cartId);
  } catch {
    // Private browsing or storage disabled — the checkout URL still works.
  }
}

export function forgetCart(): void {
  try {
    window.localStorage.removeItem(CART_ID_KEY);
  } catch {
    /* no-op */
  }
}

export async function getExistingCart(): Promise<Cart | null> {
  let cartId: string | null = null;
  try {
    cartId = window.localStorage.getItem(CART_ID_KEY);
  } catch {
    return null;
  }
  if (!cartId) return null;

  try {
    const data = await storefront<{ cart: Cart | null }>(
      GET_CART,
      { cartId },
      { cache: "no-store" }
    );
    if (!data.cart) forgetCart(); // cart expired or was completed
    return data.cart;
  } catch {
    return null;
  }
}
