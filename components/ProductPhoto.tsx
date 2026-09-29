import Image from "next/image";
import type { ShopifyImage } from "@/lib/shopify/products";

/**
 * A photo slot for a product. It shows the photograph uploaded in the Shopify
 * admin when there is one, and otherwise the default: the crest and wordmark
 * in bronze, with a line saying the photograph is on its way.
 *
 * The frame is fixed at 4:5 either way, so a grid does not jump when some
 * products have photographs and others do not.
 */
export default function ProductPhoto({
  image,
  alt,
  sizes = "(max-width: 56rem) 100vw, 33vw",
  priority = false,
}: {
  image: ShopifyImage | null | undefined;
  /** Used when the Shopify image has no alt text of its own. */
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className="cp-photo" data-empty={image ? undefined : "true"}>
      {image ? (
        <Image
          src={image.url}
          alt={image.altText || alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="cp-photo__fallback"><DefaultPhoto /></div>
      )}
    </div>
  );
}

/** The default for a product without a photograph: the horizontal logo. */
function DefaultPhoto() {
  return (
    <div className="cp-photo__default">
      <span className="cp-photo__logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/crest.svg" alt="" width={40} height={50} />
        <span>ChronoProtect+</span>
      </span>
      <span className="cp-photo__note">Photo coming soon</span>
    </div>
  );
}
