import fitmentData from "@/data/fitment.json";

/**
 * Oysterflex is listed so the catalog can describe what a reference is on, but
 * no kit is cut for it — a family on Oysterflex is ChronoGuard+ only, and
 * ChronoGuard+ has no Bracelet variant in Shopify, so the name never travels
 * there.
 */
export type BraceletName = "Oyster" | "Jubilee" | "President" | "Oysterflex";

export type CoverageName = "chronoshield" | "chronoguard";

/**
 * `bespoke` families are cut to order rather than sold from the configurator —
 * diamond-paved pieces where the stone setting changes the template and the
 * studio quotes per watch. They are listed so the reference still resolves and
 * the customer is told what happens next, instead of hitting a dead end.
 */
export type FitmentStatus = "active" | "bespoke";

export interface FitmentFamily {
  model: string;
  series: string | null;
  matchType: "exact" | "prefix";
  references: string[];
  /**
   * Which lines are cut for this family. ChronoShield+ runs over the bracelet,
   * so a family on a strap we do not cut lists ChronoGuard+ only.
   */
  coverage: CoverageName[];
  /**
   * Which bracelets this family was sold on. One entry means the configurator
   * can settle it from the reference alone and skip the question; several means
   * it has to ask, and offers only these.
   */
  bracelets?: BraceletName[];
  status: FitmentStatus;
}

/**
 * True when a reference is cut to order rather than sold from the configurator.
 * The stone setting changes the template on these, so the studio quotes per
 * watch instead of shipping a stock kit.
 */
export function isBespoke(reference: string): boolean {
  return findFitment(reference)?.family.status === "bespoke";
}

/** Every bracelet the kits are cut for, used when the family does not say. */
export const ALL_BRACELETS: BraceletName[] = ["Oyster", "Jubilee", "President"];

export interface FitmentMatch {
  family: FitmentFamily;
  reference: string;
}

const families = (fitmentData as { families: FitmentFamily[] }).families;

export function allFamilies(): FitmentFamily[] {
  return families;
}

function normalize(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

/**
 * Looks up a reference in the fitment catalog.
 *
 * Datejust families are stored as reference prefixes ("1263-") because Rolex
 * appends dial and bezel digits per configuration, so those match on the leading
 * digits. Every other family stores complete references and matches exactly.
 */
export function findFitment(reference: string): FitmentMatch | null {
  const query = normalize(reference);
  if (!query) return null;

  for (const family of families) {
    for (const ref of family.references) {
      if (family.matchType === "prefix") {
        const prefix = normalize(ref);
        if (query.startsWith(prefix)) return { family, reference: ref };
      } else if (normalize(ref) === query) {
        return { family, reference: ref };
      }
    }
  }
  return null;
}

/** Type-ahead suggestions for the reference field. */
export function suggestReferences(input: string, limit = 6): string[] {
  const query = normalize(input);
  if (query.length < 2) return [];

  const hits: string[] = [];
  for (const family of families) {
    for (const ref of family.references) {
      if (normalize(ref).startsWith(query) && !hits.includes(ref)) {
        hits.push(ref);
        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}

/**
 * The bracelets a reference could be on.
 *
 * Falls back to all of them for a reference the catalog does not know, so an
 * unlisted watch is asked rather than assumed. A single entry is the signal to
 * skip the question and fill it in.
 */
export function braceletsFor(reference: string): BraceletName[] {
  const match = findFitment(reference);
  const listed = match?.family.bracelets;
  return listed && listed.length > 0 ? listed : ALL_BRACELETS;
}

/** Every line the kits are cut for, used when the family does not say. */
export const ALL_COVERAGE: CoverageName[] = ["chronoshield", "chronoguard"];

/**
 * Which lines a reference can actually have.
 *
 * A reference the catalog does not know gets both, so an unlisted watch is not
 * quietly refused a product.
 */
export function coverageFor(reference: string): CoverageName[] {
  const match = findFitment(reference);
  const listed = match?.family.coverage;
  return listed && listed.length > 0 ? listed : ALL_COVERAGE;
}

/** Which coverage line the catalog recommends for a reference, if any. */
export function defaultCoverage(reference: string): "chronoshield" | "chronoguard" | null {
  const match = findFitment(reference);
  return match?.family.coverage[0] ?? null;
}
