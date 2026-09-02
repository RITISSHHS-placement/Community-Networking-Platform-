export default function Radar({ center = '📍', dots = [] }) {
  return (
    <div className="radar-wrap" aria-hidden="true">
      <div className="radar-ring r1" />
      <div className="radar-ring r2" />
      <div className="radar-ring r3" />
      <div className="radar-ring r4" />
      <div className="radar-sweep" />
      <div className="radar-center">{center}</div>
      {dots.map((d, i) => (
        <div key={i}>
          <div className={`radar-dot${d.variant ? ' ' + d.variant : ''}`} style={{ top: d.top, left: d.left }} />
          {d.label && (
            <div className="radar-label" style={{ top: d.top, left: d.left }}>
              {d.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
