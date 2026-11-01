/**
 * Care and removal, said once and shown in two places: the end of the
 * installation page (#care) and the /care page, which the QR code on the
 * dealer fitting card opens. Visits to /care are how the card is counted.
 */
export default function CareAndRemoval() {
  return (
    <dl className="cp-spec" style={{ marginTop: "2.5rem" }}>
      <Row label="Everyday">
        Wash and wipe the watch as you always have. The film takes soap and water without complaint.
      </Row>
      <Row label="Avoid">
        Solvents, abrasive polish, and ultrasonic cleaners. They will haze the surface long before
        they trouble the adhesive.
      </Row>
      <Row label="Removal">
        Warm the piece gently, lift a corner with a fingernail, and pull back on itself at a shallow
        angle. The adhesive releases clean and leaves no residue.
      </Row>
      <Row label="Replacement">
        Film is a wear item. Most owners re-cover a daily-wear piece every year or two, and a rotation
        piece far less often.
      </Row>
    </dl>
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
