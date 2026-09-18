/**
 * Shopify Storefront API client.
 *
 * Uses a public storefront access token, which is safe to expose in the browser —
 * it is scoped to unauthenticated read operations and cart mutations only.
 * Never put an Admin API token in this file.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? "2026-01";

export class ShopifyError extends Error {
  constructor(message: string, readonly detail?: unknown) {
    super(message);
    this.name = "ShopifyError";
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  init?: { cache?: RequestCache; revalidate?: number }
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new ShopifyError(
      "Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN."
    );
  }

  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: init?.cache,
    ...(init?.revalidate !== undefined
      ? { next: { revalidate: init.revalidate } }
      : {}),
  });

  if (!res.ok) {
    throw new ShopifyError(`Storefront API returned ${res.status}`, await res.text());
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "), json.errors);
  }
  if (!json.data) {
    throw new ShopifyError("Storefront API returned no data");
  }

  return json.data;
}
