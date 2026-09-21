import looksData from "@/data/looks.json";

export type Look = {
  ref: string;
  metal: string;
  bezel: string;
  dial?: string;
  nickname?: string;
  detail?: string;
  /**
   * Destro: the crown, guards and date window sit at 9 rather than 3. Only the
   * left-handed GMT-Master II is built this way.
   */
  lefty?: boolean;
  /** A seconds hand that breaks the metal rule, like the Le Mans's red one. */
  seconds?: string;
};

export const LOOKS = looksData.looks as Look[];

const byRef = new Map(LOOKS.map((look) => [look.ref.toUpperCase(), look]));

export function lookFor(reference: string): Look | undefined {
  return byRef.get(reference.trim().toUpperCase());
}

/** True for a left-handed watch, whose crown is on the other side. */
export function isLefty(reference: string): boolean {
  return lookFor(reference)?.lefty === true;
}

/**
 * A Datejust as an owner sees it. The Datejust is catalogued by size rather
 * than by reference, so these are looks, not numbers: the metal, the bezel and
 * the dial, and which sizes it comes in (both, unless it says otherwise).
 */
export type DatejustLook = {
  id: string;
  metal: string;
  bezel: "smooth" | "fluted";
  dial: string;
  nickname?: string;
  sizes?: number[];
};

export const DATEJUST_LOOKS = (looksData as { datejust?: DatejustLook[] }).datejust ?? [];

export const DATEJUST_SIZES: Array<{ size: number; token: string; label: string; detail: string }> = [
  { size: 41, token: "1263-", label: "Datejust 41", detail: "The larger case, 2016 onward" },
  { size: 36, token: "1262-", label: "Datejust 36", detail: "The classic size, every era" },
];
