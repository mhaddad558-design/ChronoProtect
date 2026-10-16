import type { Metadata } from "next";
import { CookieSettingsLink } from "@/components/ConsentBar";
import { getPrivacyPolicy } from "@/lib/shopify/policies";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ChronoProtect+ handles your information, and the cookies this site uses.",
};

// Re-read the policy from Shopify at most once an hour.
export const revalidate = 3600;

export default async function PrivacyPage() {
  const policy = await getPrivacyPolicy();

  return (
    <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem)" }}>
      <div className="cp-measure">
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>Privacy policy.</h1>

        {policy ? (
          // Written in the Shopify admin, under Settings, Policies.
          <div className="cp-policy" dangerouslySetInnerHTML={{ __html: policy.body }} />
        ) : (
          <div className="cp-policy">
            <p>
              Our full privacy policy is being finalized. Until it is published here, write to{" "}
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a> with any question about your
              information and we will answer it.
            </p>
          </div>
        )}

        <div className="cp-policy" id="cookies">
          <h2>Cookies on this site</h2>
          <p>
            We ask before setting any cookie that tracks you. If you accept, the Meta pixel measures
            visits from our Instagram and Facebook ads: the pages you view and the kits you add to
            your cart. If you decline, it never loads.
          </p>
          <p>
            Two things run either way, and neither sets a cookie: Vercel Analytics, which counts
            page views without identifying you, and Vercel Speed Insights, which measures how fast
            pages load.
          </p>
          <p>
            Your browser also keeps your cart, a kit finder you have not finished, and your cookie
            choice, so they are still there when you come back. They stay on your device.
          </p>
          <p>
            Checkout is hosted by Shopify, which asks for its own consent where the law requires
            it.
          </p>
          <p>
            <CookieSettingsLink />
          </p>
        </div>
      </div>
    </section>
  );
}
