import type { Metadata } from "next";
import Link from "next/link";
import CareAndRemoval from "@/components/CareAndRemoval";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Care and removal",
  description:
    "Looking after ChronoProtect+ film: everyday care, what to avoid, how it comes off clean, and when to re-cover the watch.",
};

/**
 * The page the QR code on the dealer fitting card opens. It has its own path,
 * rather than /installation#care, so Web Analytics counts card scans by page.
 */
export default function CarePage() {
  return (
    <>
      <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 3rem" }}>
        <div className="cp-measure">
          <p className="cp-eyebrow">Care and removal</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>It comes off the way it went on.</h1>
          <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
            Wear the watch as you always have. The film takes the desk edges and door frames so the
            metal does not, and when it is time for new film, it lifts clean and leaves nothing
            behind.
          </p>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>Looking after the film.</h2>
          <CareAndRemoval />
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <div className="cp-measure">
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>Time for new film?</h2>
            <p className="cp-lede" style={{ marginTop: "1rem" }}>
              Every kit is cut to the reference, so a replacement fits the way the first one did.
              Start with the number on the case.
            </p>
          </div>
          <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
            <Link href="/find-your-kit" className="cp-btn">
              Find your kit
            </Link>
            <a
              href={`mailto:${STUDIO_EMAIL}?subject=Care%20and%20removal`}
              className="cp-btn cp-btn--ghost"
            >
              Ask the studio
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
