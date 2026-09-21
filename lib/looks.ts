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
