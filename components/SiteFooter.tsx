import Link from "next/link";
import Crest from "./Crest";
import { SITE_NAME, SITE_TAGLINE, STUDIO_EMAIL } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="cp-footer">
      <div className="cp-shell">
        <div className="cp-footer__cols">
          <div>
            <Link href="/" className="cp-wordmark">
              <Crest size={28} />
              {SITE_NAME}
            </Link>
            <p style={{ color: "var(--cp-ink-faint)", fontSize: "0.9rem", maxWidth: "22rem" }}>
              {SITE_TAGLINE}
            </p>
          </div>

          <div>
            <h4>Kits</h4>
            <ul>
              <li>
                <Link href="/kits/chronoshield">ChronoShield+</Link>
              </li>
              <li>
                <Link href="/kits/chronoguard">ChronoGuard+</Link>
              </li>
              <li>
                <Link href="/installation">Studio installation</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Fitment</h4>
            <ul>
              <li>
                <Link href="/find-your-kit">Find your kit</Link>
              </li>
              <li>
                <Link href="/catalog">Reference catalog</Link>
              </li>
              <li>
                {/* encodeURIComponent, so the brand's "+" does not decode as a space. */}
                <a
                  href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
                    "ChronoShield+ fit guide"
                  )}`}
                >
                  Request a fit guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Studio</h4>
            <ul>
              <li>
                <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
              </li>
              <li>
                <Link href="/installation#care">Care and removal</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="cp-footer__base">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}
          </span>
          <span>
            Not affiliated with, endorsed by, or sponsored by Rolex SA. Reference numbers are used
            only to describe fitment.
          </span>
        </div>
      </div>
    </footer>
  );
}
