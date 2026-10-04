/**
 * The homepage hero's moving background: a watch worn in open water, blurred
 * so it reads as light and movement behind the headline rather than as a
 * picture. The blur is baked into the file, so the browser does no filtering
 * and the clip stays small. It plays forward then in reverse, so the loop has
 * no jump, and it is silent. WebM first because it is a third the size; the
 * MP4 is for older Safari.
 *
 * Decorative only, so it is hidden from assistive technology. Visitors who
 * ask for reduced motion get the still poster instead (see depth.css).
 */
export default function HeroVideo() {
  return (
    <div className="cp-hero__video" aria-hidden="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero/hero-water.jpg"
        tabIndex={-1}
      >
        <source src="/hero/hero-water.webm" type="video/webm" />
        <source src="/hero/hero-water.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
