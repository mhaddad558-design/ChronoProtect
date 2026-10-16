"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { onConsentChange } from "@/lib/consent";
import { revokePixel, trackPixel } from "@/lib/meta-pixel";

/**
 * Sends a PageView on first load and on every client-side navigation. The
 * App Router swaps pages without a reload, so the pixel's own load-time
 * PageView would only ever see the first page.
 *
 * Nothing is sent until the visitor accepts cookies. Accepting part-way
 * through a visit sends the PageView for the page they are on.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    trackPixel("PageView");
  }, [pathname, search]);

  useEffect(
    () =>
      onConsentChange((choice) => {
        if (choice === "granted") trackPixel("PageView");
        else revokePixel();
      }),
    []
  );

  return null;
}

/** ViewContent for a kit page, keyed by the Shopify handle. */
export function TrackKitView({ handle, name }: { handle: string; name: string }) {
  useEffect(() => {
    trackPixel("ViewContent", {
      content_ids: [handle],
      content_name: name,
      content_type: "product",
    });
  }, [handle, name]);

  return null;
}
