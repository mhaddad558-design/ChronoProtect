/** Shared site constants. Nothing here is priced — prices come from Shopify. */

/**
 * The plus is part of the brand, not decoration — it appears on the master
 * wordmark and on both product lines. Shopify handles, route segments, and the
 * `coverage` keys in fitment.json deliberately stay unsuffixed: they are
 * identifiers, and renaming them would break product lookup until the Shopify
 * admin matched.
 */
export const SITE_NAME = "ChronoProtect+";
export const SITE_TAGLINE = "Protect the piece, change the presence.";
export const STUDIO_EMAIL = "chronoshield@polsia.app";

export const FINISHES = [
  {
    name: "Gloss",
    detail:
      "Optically invisible. Reflects light like the polished metal beneath, so the watch reads unchanged.",
  },
  {
    name: "Stealth",
    detail: "A deep satin finish that quiets the whole watch and takes the shine out of the bezel.",
  },
] as const;

export interface KitCopy {
  title: string;
  /**
   * The word set inside the crest on this line's badge lockup, under "Chrono".
   * Uppercase, with the plus — see components/Lockup.tsx.
   */
  lockupWord: string;
  coverage: string;
  summary: string;
  /** Surfaces the film goes onto. */
  covers: readonly string[];
  /** Surfaces it deliberately leaves bare. */
  omits: readonly string[];
}

export const KIT_COPY: Record<"chronoshield" | "chronoguard", KitCopy> = {
  chronoshield: {
    title: "ChronoShield+",
    lockupWord: "SHIELD+",
    coverage: "Case, bezel, full bracelet, and clasp",
    summary:
      "Whole-watch coverage for a piece that lives on the wrist. Every link is cut individually, so the bracelet keeps its articulation and the film disappears into the brushing.",
    covers: [
      "Case flanks, lugs, and lug holes",
      "Bezel top and outer edge",
      "Every bracelet link, top and side",
      "Clasp cover and folding blade",
    ],
    omits: [],
  },
  chronoguard: {
    title: "ChronoGuard+",
    lockupWord: "GUARD+",
    coverage: "Case and clasp only",
    summary:
      "The two surfaces that take the brunt of daily wear, protected without touching the bracelet. A shorter application and a lighter footprint on the watch.",
    covers: ["Case flanks, lugs, and lug holes", "Bezel top and outer edge", "Clasp cover"],
    omits: ["Bracelet links are left bare"],
  },
};
