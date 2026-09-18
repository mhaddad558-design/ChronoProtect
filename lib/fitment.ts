import fitmentData from "@/data/fitment.json";

export type BraceletName = "Oyster" | "Jubilee" | "President";

export interface FitmentFamily {
  model: string;
  series: string | null;
  matchType: "exact" | "prefix";
  references: string[];
  coverage: Array<"chronoshield" | "chronoguard">;
  /**
   * Which bracelets this family was sold on. One entry means the configurator
   * can settle it from the reference alone and skip the question; several means
   * it has to ask, and offers only these.
   */
  bracelets?: BraceletName[];
  status: string;
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

/** Which coverage line the catalog recommends for a reference, if any. */
export function defaultCoverage(reference: string): "chronoshield" | "chronoguard" | null {
  const match = findFitment(reference);
  return match?.family.coverage[0] ?? null;
}
