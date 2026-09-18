/**
 * The ChronoProtect+ crest — the crown-and-shield mark from the brand artwork.
 *
 * The source file is a 4MB Instagram export: an opaque post background, 19
 * embedded PNGs, and ~3,400 clip paths of halftone dots, with the crest itself
 * drawn as four vector paths in the brand bronze. `public/crest.svg` is those
 * four paths and their clips, lifted out and nothing else — same artwork,
 * transparent, 4.8KB.
 *
 * Served as a file rather than inlined so it is fetched and cached once instead
 * of being repeated in the markup of every page. The bronze is baked into the
 * file because the crest is always bronze.
 */

/** Natural aspect of the mark, from the extracted viewBox. */
const RATIO = 526 / 662;

export default function Crest({ size = 30 }: { size?: number }) {
  return (
    <img
      src="/crest.svg"
      alt=""
      width={Math.round(size * RATIO)}
      height={size}
      style={{ display: "block" }}
    />
  );
}
