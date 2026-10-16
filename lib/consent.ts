/**
 * The visitor's cookie choice, kept in this browser only.
 *
 * Nothing that sets a tracking cookie runs until the choice is "granted":
 * today that is the Meta pixel (see lib/meta-pixel.ts). Vercel Analytics and
 * Speed Insights set no cookies, so they run regardless. Checkout is on
 * Shopify, which asks again with its own banner.
 */

export type ConsentChoice = "granted" | "denied";

const KEY = "cp-consent";
const CHANGE = "cp-consent-change";
const OPEN = "cp-consent-open";

interface Stored {
  choice: ConsentChoice;
  /** When it was made, so a later policy change can ask again. */
  at: string;
}

/** The saved choice, or null if the visitor has not chosen yet. */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<Stored>;
    return stored.choice === "granted" || stored.choice === "denied" ? stored.choice : null;
  } catch {
    // Storage blocked (private mode, strict settings): treat as not chosen.
    return null;
  }
}

export function hasConsent(): boolean {
  return readConsent() === "granted";
}

export function writeConsent(choice: ConsentChoice): void {
  try {
    const stored: Stored = { choice, at: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    // Still honour the choice for this page view.
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CHANGE, { detail: choice }));
}

/** Calls back with each new choice. Returns the unsubscribe. */
export function onConsentChange(callback: (choice: ConsentChoice) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<ConsentChoice>).detail);
  window.addEventListener(CHANGE, listener);
  return () => window.removeEventListener(CHANGE, listener);
}

/** Shows the consent bar again, from the footer's cookie settings link. */
export function openConsent(): void {
  window.dispatchEvent(new Event(OPEN));
}

export function onConsentOpen(callback: () => void): () => void {
  window.addEventListener(OPEN, callback);
  return () => window.removeEventListener(OPEN, callback);
}
