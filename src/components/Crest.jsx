import { useRef } from 'react';

// Escudo del Instituto Pedagógico CREAR, reconstruido en SVG y animado
function Star({ x, y, r = 7, fill, delay = 0, className = 'crest-star' }) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    pts.push(`${(x + rad * Math.cos(ang)).toFixed(2)},${(y + rad * Math.sin(ang)).toFixed(2)}`);
  }
  return <polygon className={className} points={pts.join(' ')} fill={fill} style={{ animationDelay: `${delay}s` }} />;
}

const SHIELD = 'M100 16 C70 16 40 22 22 34 L22 112 C22 166 58 200 100 220 C142 200 178 166 178 112 L178 34 C160 22 130 16 100 16 Z';
const INNER = 'M100 52 C80 52 62 56 52 62 L52 112 C52 148 74 170 100 184 C126 170 148 148 148 112 L148 62 C138 56 120 52 100 52 Z';

export default function Crest({ size = 220, interactive = true, className = '' }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    ref.current.style.setProperty('--rx', `${-dy * 22}deg`);
    ref.current.style.setProperty('--ry', `${dx * 26}deg`);
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  };

  return (
    <div className={`crest-wrap ${className}`} style={{ width: size }} ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <svg viewBox="0 0 230 236" className="crest-svg" aria-label="Escudo Instituto Pedagógico CREAR">
        <defs>
          <clipPath id="shieldClip"><path d={SHIELD} /></clipPath>
          <linearGradient id="shine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Hojas */}
        <g className="crest-leaves">
          <path className="leaf leaf-1" d="M168 40 C160 14 176 -2 196 2 C200 22 190 40 168 40 Z" fill="#1D2A6B" />
          <path className="leaf leaf-2" d="M176 52 C188 30 210 26 226 38 C218 58 198 64 176 52 Z" fill="#1D2A6B" />
          <path className="leaf leaf-3" d="M172 68 C190 60 208 68 214 84 C196 92 180 86 172 68 Z" fill="#1D2A6B" />
          <path d="M168 40 L184 16 M176 52 L210 38 M172 68 L204 80" stroke="#fff" strokeWidth="1.6" opacity="0.6" />
        </g>

        {/* Escudo */}
        <g clipPath="url(#shieldClip)">
          <rect x="0" y="0" width="230" height="236" fill="#fff" />
          <path d="M0 0 H230 V78 C170 70 60 70 0 78 Z" fill="#C8352B" />
          <path d="M0 86 C60 78 170 78 230 86 V96 C170 88 60 88 0 96 Z" fill="#C8352B" />
          <path d="M0 104 C60 96 170 96 230 104 V116 C170 108 60 108 0 116 Z" fill="#C8352B" />
          <rect className="crest-shine" x="-120" y="0" width="80" height="236" fill="url(#shine)" transform="skewX(-18)" />
        </g>
        <path className="crest-outline" d={SHIELD} fill="none" stroke="#1D2A6B" strokeWidth="6" strokeLinejoin="round" />
        <path d={SHIELD} fill="none" stroke="#fff" strokeWidth="2" transform="translate(100 118) scale(0.94) translate(-100 -118)" opacity="0.9" />

        {/* Escudo interior */}
        <path d={INNER} fill="#fff" stroke="#1D2A6B" strokeWidth="3.5" />

        {/* Estrellas blancas sobre la banda roja */}
        <Star x={100} y={32} r={8} fill="#fff" delay={0} />
        <Star x={160} y={44} r={7.5} fill="#fff" delay={0.4} />
        <Star x={40} y={44} r={7.5} fill="#fff" delay={0.8} />
        <Star x={38} y={98} r={7} fill="#fff" delay={1.2} />
        <Star x={162} y={98} r={7} fill="#fff" delay={1.6} />

        {/* Estrellas azules abajo */}
        <Star x={56} y={150} r={6.5} fill="#1D2A6B" delay={0.2} />
        <Star x={144} y={150} r={6.5} fill="#1D2A6B" delay={0.6} />
        <Star x={74} y={182} r={6.5} fill="#1D2A6B" delay={1.0} />
        <Star x={126} y={182} r={6.5} fill="#1D2A6B" delay={1.4} />
        <Star x={100} y={200} r={6.5} fill="#1D2A6B" delay={1.8} />

        {/* Corazón + cerebro */}
        <g className="crest-heart">
          <path d="M100 98 C92 86 72 88 72 106 C72 120 88 130 100 142 Z" fill="#C8352B" />
          <g fill="none" stroke="#1D2A6B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M101 92 C108 84 122 86 124 96 C132 98 134 110 128 116 C132 124 124 134 116 132 C112 140 104 140 101 136 Z" />
            <path d="M106 100 C112 98 116 104 112 108 M108 116 C114 114 120 118 118 124 M116 96 C118 102 124 104 126 102 M104 126 C108 124 110 128 108 132" />
            <circle cx="113" cy="111" r="1.6" fill="#1D2A6B" />
            <circle cx="121" cy="110" r="1.6" fill="#1D2A6B" />
          </g>
        </g>
      </svg>
      <div className="crest-glow" />
    </div>
  );
}
