"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Crest from "./Crest";
import { SITE_NAME } from "@/lib/site";

const LINKS = [
  { href: "/kits/chronoshield", label: "ChronoShield+" },
  { href: "/kits/chronoguard", label: "ChronoGuard+" },
  { href: "/catalog", label: "Fitment" },
  { href: "/installation", label: "Installation" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the panel on navigation, so following a link does not leave it open
  // over the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="cp-header">
      <div className="cp-shell cp-header__inner">
        <Link href="/" className="cp-wordmark">
          <Crest size={32} />
          <span className="cp-wordmark__text">{SITE_NAME}</span>
        </Link>

        <nav className="cp-nav" aria-label="Primary">
          <ul className="cp-nav__links" data-open={open ? "true" : "false"} id="cp-nav-links">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/find-your-kit" className="cp-btn cp-nav__cta">
            Find your kit
          </Link>

          <button
            type="button"
            className="cp-nav__toggle"
            aria-expanded={open}
            aria-controls="cp-nav-links"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="cp-nav__toggle-bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="cp-skip-visually">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
