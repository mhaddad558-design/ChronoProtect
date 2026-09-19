import type { Metadata } from "next";
import Link from "next/link";
import Price from "@/components/Price";
import { getKitProducts, startingPrice } from "@/lib/shopify/products";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Apply a ChronoProtect+ kit yourself in about an hour, or add studio installation as a separate line at checkout.",
};

export default async function InstallationPage() {
  const products = await getKitProducts();

  return (
    <>
      <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 3rem" }}>
        <div className="cp-measure">
          <p className="cp-eyebrow">Installation</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>
            An hour at the kitchen table, or an afternoon at the studio.
          </h1>
          <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
            Kits arrive pre-cut, so the work is placement and patience rather than trimming. If you
            would rather not do it over your own watch, a studio partner will.
          </p>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <p className="cp-eyebrow">Applying it yourself</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>What the hour looks like.</h2>

          <dl className="cp-spec cp-spec--steps" style={{ marginTop: "2.5rem" }}>
            <Row label="Before you start">
              Work on a clean, lint-free surface in good light, with the bracelet off the wrist. Take
              spring bars out only if you are comfortable doing so — the kit does not require it.
            </Row>
            <Row label="Clean">
              Wipe every surface with the supplied alcohol pad and let it flash off. Anything left
              under the film stays under the film.
            </Row>
            <Row label="Place">
              Peel one piece at a time and set it down from one edge rather than dropping it flat.
              Each piece is cut for one location, and the sheet is numbered in order.
            </Row>
            <Row label="Seat">
              Press from the centre outward with the squeegee. Small edge lift settles over the
              first day as the adhesive wets out.
            </Row>
            <Row label="Rest">
              Leave the watch off the wrist for a few hours before wearing it. Keep it away from
              water for the first day.
            </Row>
          </dl>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <div className="cp-measure">
            <p className="cp-eyebrow">Studio installation</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
              Let a partner fit it instead.
            </h2>
            <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
              Choose studio installation in the configurator and it is added as its own line at
              checkout, priced and fulfilled separately from the kit. The studio contacts you to
              arrange the drop-off once the order is in.
            </p>
          </div>

          <div style={{ marginTop: "2.5rem" }}>
            <Price value={startingPrice(products.installation)} lead="From" />
          </div>

          <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
            <Link href="/find-your-kit" className="cp-btn">
              Find your kit
            </Link>
            <a href={`mailto:${STUDIO_EMAIL}?subject=Studio%20installation`} className="cp-btn cp-btn--ghost">
              Ask the studio
            </a>
          </div>
        </div>
      </section>

      <section className="cp-band cp-band--mid" id="care">
        <div className="cp-shell">
          <p className="cp-eyebrow">Care and removal</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
            It comes off the way it went on.
          </h2>

          <dl className="cp-spec" style={{ marginTop: "2.5rem" }}>
            <Row label="Everyday">
              Wash and wipe the watch as you always have. The film takes soap and water without
              complaint.
            </Row>
            <Row label="Avoid">
              Solvents, abrasive polish, and ultrasonic cleaners. They will haze the surface long
              before they trouble the adhesive.
            </Row>
            <Row label="Removal">
              Warm the piece gently, lift a corner with a fingernail, and pull back on itself at a
              shallow angle. The adhesive releases clean and leaves no residue.
            </Row>
            <Row label="Replacement">
              Film is a wear item. Most owners re-cover a daily-wear piece every year or two, and a
              rotation piece far less often.
            </Row>
          </dl>
        </div>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cp-spec__row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
