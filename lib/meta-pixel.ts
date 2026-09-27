/**
 * Meta pixel, for Instagram and Facebook ads.
 *
 * Off unless NEXT_PUBLIC_META_PIXEL_ID is set, so local development and
 * previews send nothing. The storefront reports PageView, ViewContent and
 * AddToCart. InitiateCheckout and Purchase happen on Shopify's hosted
 * checkout, so they come from Shopify's Facebook and Instagram channel on the
 * same pixel; firing them here as well would count every sale twice.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let initialised = false;

/**
 * Installs Meta's queueing stub and loads fbevents.js once. Calls made before
 * the script arrives are queued and sent when it does, so the first PageView
 * is never lost to a race with the script tag.
 */
function ensurePixel(): Fbq | null {
  if (!META_PIXEL_ID || typeof window === "undefined") return null;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  if (!initialised) {
    window.fbq("init", META_PIXEL_ID);
    initialised = true;
  }
  return window.fbq;
}

/** Sends a standard pixel event. A no-op when the pixel is off. */
export function trackPixel(event: string, params?: Record<string, unknown>): void {
  ensurePixel()?.("track", event, params);
}

/**
 * Gives a just-sent event time to leave the page before a full navigation,
 * such as the redirect to Shopify's checkout, cancels it. Returns at once
 * when the pixel is off.
 */
export function flushPixel(ms = 300): Promise<void> {
  if (!META_PIXEL_ID) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
