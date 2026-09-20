import Link from "next/link";
import BandTexture from "@/components/BandTexture";
import CoverageExplorer from "@/components/CoverageExplorer";
import FinishSwatch from "@/components/FinishSwatch";
import HeroReference from "@/components/HeroReference";
import HeroTilt from "@/components/HeroTilt";
import Lockup from "@/components/Lockup";
import Price from "@/components/Price";
import { allFamilies } from "@/lib/fitment";
import { getKitProducts, startingPrice } from "@/lib/shopify/products";
import { FINISHES, KIT_COPY, SITE_NAME } from "@/lib/site";

const STEPS = [
  {
    title: "Give us the reference",
    body: "The configurator checks the number against the fitment catalog and confirms the model before you go any further.",
  },
  {
    title: "Choose coverage and finish",
    body: "Case to clasp or case and clasp, in gloss or stealth. Five questions, no account required.",
  },
  {
    title: "We cut the kit",
    body: "Nothing is stocked. The template for your reference is cut after the order lands, so the tolerances stay tight.",
  },
  {
    title: "Apply it, or let the studio",
    body: "Kits arrive pre-cut and ready for a careful hour at home. A studio partner can fit it instead.",
  },
];

export default async function HomePage() {
  const products = await getKitProducts();
  const families = allFamilies();
  const references = families.flatMap((family) => family.references);
  const referenceCount = references.length;

  return (
    <>
      <section className="cp-shell cp-hero">
        <div className="cp-pagehead">
          <div>
            <p className="cp-eyebrow">Precision-cut protective film</p>
            <h1>A watch you wear should not be a watch you worry about.</h1>
            <p className="cp-hero__line">
              Every kit is cut to a single reference, applied by hand, and removed without residue.
              The case keeps its lines, the bracelet keeps its brushing, and the piece keeps its
              value.
            </p>
            <HeroReference referenceCount={referenceCount} />
          </div>

          {/*
            The crest sits on its own halftone, taken from the logo artwork, and
            tilts toward the pointer so its layers separate.
          */}
          <HeroTilt className="cp-pagehead__mark cp-halftone">
            <Lockup word="PROTECT+" label={SITE_NAME} height={340} />
          </HeroTilt>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <BandTexture kind="guilloche" id="home-coverage-bg" />
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
            Cover the whole watch, or only where it takes the wear.
          </h2>

          <div className="cp-lines">
            <CoverageExplorer />
            <div className="cp-lines__cards">
              <KitCard handle="chronoshield" price={startingPrice(products.chronoshield)} />
              <KitCard handle="chronoguard" price={startingPrice(products.chronoguard)} />
            </div>
          </div>
        </div>
      </section>

      <section className="cp-band">
        <BandTexture kind="brushing" id="home-steps-bg" rotate={-4} />
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>Four steps, one reference.</h2>

          {/* A genuine sequence, so it is numbered and joined by a rail. */}
          <ol className="cp-steps">
            {STEPS.map((step, i) => (
              <li className="cp-steps__item" key={step.title}>
                <span className="cp-steps__node" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <BandTexture kind="moire" id="home-finishes-bg" />
        <div className="cp-shell">
          <div className="cp-measure">
            <p className="cp-eyebrow">Finishes</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
              Two surfaces, one film thickness.
            </h2>
            <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
              The finish changes how the watch reads in light. It does not change the protection.
            </p>
          </div>

          <div className="cp-finishes">
            {FINISHES.map((finish) => (
              <article className="cp-finish" key={finish.name}>
                <FinishSwatch finish={finish.name} id={`home-${finish.name}`} />
                <div>
                  <h3>{finish.name}</h3>
                  <p>{finish.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell cp-wall">
          {/* Every reference in the catalog, as the texture behind the panel. */}
          <div className="cp-wall__refs" aria-hidden="true">
            {references.map((ref) => (
              <span key={ref}>{ref.endsWith("-") ? `${ref}…` : ref}</span>
            ))}
          </div>

          <div className="cp-wall__panel">
            <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
              {referenceCount} references, checked before you order.
            </h2>
            <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
              Submariner, GMT-Master II, Daytona, and Datejust. Templates are drawn per reference,
              because a Cerachrom bezel and an engraved one are not the same cut.
            </p>
            <p style={{ marginTop: "2rem", marginBottom: 0 }}>
              <Link href="/catalog" className="cp-btn cp-btn--ghost">
                Browse the catalog
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="cp-band cp-band--mid cp-watermark">
        <BandTexture kind="engine" id="home-close-bg" />
        <div className="cp-shell cp-measure">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
            Start with the number on the case.
          </h2>
          <p className="cp-lede" style={{ margin: "1.25rem 0 2.5rem" }}>
            Five questions and you will have the right kit in the cart.
          </p>
          <Link href="/find-your-kit" className="cp-btn">
            Find your kit
          </Link>
        </div>
      </section>
    </>
  );
}

function KitCard({
  handle,
  price,
}: {
  handle: "chronoshield" | "chronoguard";
  price: string | null;
}) {
  const copy = KIT_COPY[handle];

  return (
    <article className="cp-card">
      <p className="cp-eyebrow" style={{ marginBottom: "0.75rem" }}>
        {copy.coverage}
      </p>
      <h3>{copy.title}</h3>
      <p>{copy.summary}</p>
      <div className="cp-card__foot">
        <Price value={price} lead="From" />
        <p style={{ marginTop: "1.5rem", marginBottom: 0 }}>
          <Link href={`/kits/${handle}`} className="cp-btn cp-btn--ghost">
            See what it covers
          </Link>
        </p>
      </div>
    </article>
  );
}
