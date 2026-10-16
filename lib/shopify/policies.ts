import { storefront } from "./client";
import { GET_PRIVACY_POLICY } from "./queries";

export interface ShopPolicy {
  title: string;
  /** HTML, as written in the Shopify admin. */
  body: string;
  url: string;
}

/** Edits in the Shopify admin reach the site within the hour. */
const POLICY_TTL_SECONDS = 3600;

/**
 * The privacy policy from Shopify. Null when the store is unreachable, not yet
 * configured, or has no policy saved, so the page can say so instead of failing.
 */
export async function getPrivacyPolicy(): Promise<ShopPolicy | null> {
  try {
    const data = await storefront<{ shop: { privacyPolicy: ShopPolicy | null } }>(
      GET_PRIVACY_POLICY,
      {},
      { revalidate: POLICY_TTL_SECONDS }
    );
    return data.shop.privacyPolicy;
  } catch {
    return null;
  }
}
