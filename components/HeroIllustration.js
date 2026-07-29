const HERO_NODES = Array.from({ length: 12 }, (_, i) => {
  const angle = ((i * 30 - 90) * Math.PI) / 180;
  const r = 150;
  return { x: 200 + r * Math.cos(angle), y: 200 + r * Math.sin(angle) };
});

export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="hero-illustration" aria-hidden="true">
      <defs>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#CFE0FF" />
          <stop offset="45%" stopColor="#7C6FF0" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C6FF0" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="185" className="hero-ring hero-ring-out" fill="none" stroke="url(#lineGrad)" strokeOpacity="0.12" strokeDasharray="2 10" />
      <circle cx="200" cy="200" r="165" className="hero-ring hero-ring-in" fill="none" stroke="url(#lineGrad)" strokeOpacity="0.1" strokeDasharray="1 6" />

      <g className="hero-orbit">
        {HERO_NODES.map((n, i) => (
          <line key={`spoke-${i}`} x1="200" y1="200" x2={n.x} y2={n.y} stroke="url(#lineGrad)" strokeWidth="1" className="hero-line" style={{ "--d": `${i * 0.15}s` }} />
        ))}
        {HERO_NODES.map((n, i) => {
          const next = HERO_NODES[(i + 1) % HERO_NODES.length];
          return <line key={`ring-${i}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke="url(#lineGrad)" strokeWidth="1" opacity="0.18" />;
        })}
        {HERO_NODES.map((n, i) => (
          <circle key={`node-${i}`} cx={n.x} cy={n.y} r="5" fill="#CFE0FF" className="hero-node" style={{ "--d": `${i * 0.2}s` }} />
        ))}
      </g>

      <circle cx="200" cy="200" r="30" fill="url(#coreGrad)" className="hero-core" />

      <g className="hero-electron hero-electron-a">
        <circle cx="200" cy="45" r="4" fill="#00D4FF" />
      </g>
      <g className="hero-electron hero-electron-b">
        <circle cx="355" cy="200" r="3.5" fill="#C084FC" />
      </g>
    </svg>
  );
}

