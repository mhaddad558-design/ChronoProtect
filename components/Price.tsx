/**
 * Renders a price that came from Shopify, or a neutral line when the store has
 * not been wired up yet. Never falls back to a number — prices live in Shopify.
 */
export default function Price({
  value,
  lead,
  note,
}: {
  value: string | null;
  /** Small qualifier shown before the amount, e.g. "From". */
  lead?: string;
  /** Small qualifier shown after the amount, e.g. "per kit". */
  note?: string;
}) {
  if (!value) {
    return <p className="cp-price--pending">Pricing confirmed at checkout</p>;
  }

  return (
    <p className="cp-price">
      {lead ? <span className="cp-price__note">{lead} </span> : null}
      {value}
      {note ? <span className="cp-price__note"> {note}</span> : null}
    </p>
  );
}
