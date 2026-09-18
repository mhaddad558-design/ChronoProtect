import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — precision-cut protective film for luxury watches`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Precision-cut protective film for collectible luxury watches. ChronoShield+ covers case to clasp; ChronoGuard+ covers case and clasp.",
};

export const viewport: Viewport = {
  themeColor: "#0b110d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Loaded over a link rather than next/font so the build does not need
          network access to Google's font CDN.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400..600&family=DM+Mono:wght@400;500&family=Schibsted+Grotesk:wght@400;500;600&family=Jost:wght@300;400&display=swap"
        />
      </head>
      <body>
        <a className="cp-skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
