import Link from "next/link";

export default function NotFound() {
  return (
    <section className="cp-shell cp-measure" style={{ paddingBlock: "clamp(5rem, 12vw, 9rem)" }}>
      <p className="cp-eyebrow">404</p>
      <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>That page is not in the catalog.</h1>
      <p className="cp-lede" style={{ margin: "1.25rem 0 2.5rem" }}>
        The link may be old, or the reference may have moved. Start from the configurator or check
        the fitment catalog.
      </p>
      <div className="cp-hero__actions">
        <Link href="/find-your-kit" className="cp-btn">
          Find your kit
        </Link>
        <Link href="/catalog" className="cp-btn cp-btn--ghost">
          Fitment catalog
        </Link>
      </div>
    </section>
  );
}
