import type { Metadata } from "next";
import Link from "next/link";
import Price from "@/components/Price";
import { getKitProducts, startingPrice } from "@/lib/shopify/products";
import { PARTNER_INSTALL, STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Installation",
  description: PARTNER_INSTALL
    ? "ChronoProtect+ is fitted by appointment, like paint protection film on a car: a trained fitter puts it on in about an hour. Or apply the kit yourself."
    : "ChronoProtect+ is made to be fitted by appointment, like paint protection film on a car. Fitting partners are being signed now; until then, every kit can be applied at home.",
};

/**
 * Installation, told the way car paint protection film is sold: offered with
 * the watch, fitted by a trained hand at a time the owner books. Applying the
 * kit at home is the fallback, and care and removal stays last, where the
 * dealer card's QR code points (#care).
 */
export default async function InstallationPage() {
  const products = await getKitProducts();

  return (
    <>
      <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 3rem" }}>
        <div className="cp-measure">
          <p className="cp-eyebrow">Installation</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>
            Fitted by appointment, like paint protection film.
          </h1>
          <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
            Almost no one fits paint protection film to their own car. The dealer offers it with the
            car, and a fitter puts it on at a time the owner books. ChronoProtect+ works the same way:
            the film is offered with the watch, and a trained fitter puts it on in about an hour.
            {PARTNER_INSTALL
              ? ""
              : " Fitting partners are being signed now. Until they are in place, every kit can be applied at home, with the steps below."}
          </p>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <p className="cp-eyebrow">How a fitting works</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>Book it when it suits you.</h2>

          <dl className="cp-spec cp-spec--steps" style={{ marginTop: "2.5rem" }}>
            <Row label="Choose the kit">
              With the watch, from the store that sells it, or here online. Each kit is cut to your
              reference.
            </Row>
            <Row label="Book a time">
              The next day, the next week, or whenever suits you. Or leave the watch with the store for
              a day or two.
            </Row>
            <Row label="The fitting">
              About an hour with a trained fitter. Every piece is pre-cut and numbered, so nothing is
              trimmed over your watch.
            </Row>
            <Row label="Afterwards">
              Leave the watch off the wrist for a few hours, and keep it away from water for the first
              day.
            </Row>
          </dl>
        </div>
      </section>

      {PARTNER_INSTALL ? (
        <section className="cp-band">
          <div className="cp-shell">
            <div className="cp-measure">
              <p className="cp-eyebrow">Studio installation</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
                Book a fitting with your kit.
              </h2>
              <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
                Choose studio installation in the configurator and it is added as its own line at
                checkout, priced and fulfilled separately from the kit. The studio contacts you to
                book the fitting once the kit is ready.
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
      ) : (
        <section className="cp-band">
          <div className="cp-shell">
            <div className="cp-measure">
              <p className="cp-eyebrow">Fitting partners</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
                Partner stores are being signed now.
              </h2>
              <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
                We are signing watch stores to offer the film with the watches they sell and fit it by
                appointment. Until fittings open, every kit is made to be applied at home in about an
                hour.
              </p>
            </div>

            <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
              <Link href="/find-your-kit" className="cp-btn">
                Find your kit
              </Link>
              <a
                href={`mailto:${STUDIO_EMAIL}?subject=Fitting%20by%20appointment`}
                className="cp-btn cp-btn--ghost"
              >
                Ask to be told when fittings open
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <div className="cp-measure">
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>Run a watch store?</h2>
            <p className="cp-lede" style={{ marginTop: "1rem" }}>
              Offer ChronoProtect+ as an add-on with every Datejust, Submariner, GMT-Master II and
              Daytona you sell, and fit it by appointment. Kits come to you wholesale, and we train
              your fitter on a display piece.
            </p>
            <p style={{ marginTop: "1.5rem" }}>
              <a href={`mailto:${STUDIO_EMAIL}?subject=Fitting%20partner`}>Become a fitting partner</a>
            </p>
          </div>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <p className="cp-eyebrow">Applying it yourself</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>If you would rather do it yourself.</h2>
          <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
            Kits arrive pre-cut, so the work is placement and patience rather than trimming. Allow
            about an hour.
          </p>

          <dl className="cp-spec cp-spec--steps" style={{ marginTop: "2.5rem" }}>
            <Row label="Before you start">
              Work on a clean, lint-free surface in good light, with the bracelet off the wrist. Take
              spring bars out only if you are comfortable doing so; the kit does not require it.
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
