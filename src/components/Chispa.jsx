// Chispa: la mascota de los Bits CREAR (una gotita de luz con una hojita como la del escudo)
export default function Chispa({ size = 140, mood = 'happy', message, className = '' }) {
  return (
    <div className={`chispa ${className}`} style={{ width: size }}>
      {message && <div className="chispa-bubble">{message}</div>}
      <svg viewBox="0 0 140 150" className={`chispa-svg mood-${mood}`}>
        <ellipse cx="70" cy="144" rx="34" ry="5" fill="#1D2A6B" opacity="0.15" className="chispa-shadow" />
        <g className="chispa-body">
          <path className="chispa-leaf" d="M70 22 C64 6 78 -2 90 4 C90 16 82 24 70 22 Z" fill="#2E9E5B" />
          <path d="M70 22 L84 8" stroke="#1E7A44" strokeWidth="2" />
          <path d="M70 20 C108 20 128 54 128 88 C128 120 102 138 70 138 C38 138 12 120 12 88 C12 54 32 20 70 20 Z" fill="#FFC531" stroke="#1D2A6B" strokeWidth="5" />
          <path d="M34 60 C40 44 54 36 66 34" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
          <g className="chispa-arm-l"><path d="M16 92 C2 90 -2 76 6 70" stroke="#1D2A6B" strokeWidth="5" strokeLinecap="round" fill="none" /></g>
          <g className="chispa-arm-r"><path d="M124 92 C138 86 140 70 132 62" stroke="#1D2A6B" strokeWidth="5" strokeLinecap="round" fill="none" /></g>
          <g className="chispa-eyes">
            <ellipse cx="50" cy="80" rx="9" ry="12" fill="#1D2A6B" />
            <ellipse cx="90" cy="80" rx="9" ry="12" fill="#1D2A6B" />
            <circle cx="53" cy="75" r="3.4" fill="#fff" />
            <circle cx="93" cy="75" r="3.4" fill="#fff" />
          </g>
          <ellipse cx="36" cy="100" rx="9" ry="6" fill="#FF8FB1" opacity="0.8" />
          <ellipse cx="104" cy="100" rx="9" ry="6" fill="#FF8FB1" opacity="0.8" />
          {mood === 'wow'
            ? <ellipse cx="70" cy="106" rx="9" ry="11" fill="#C8352B" stroke="#1D2A6B" strokeWidth="4" />
            : <path d="M54 100 C60 114 80 114 86 100 Z" fill="#C8352B" stroke="#1D2A6B" strokeWidth="4" strokeLinejoin="round" />}
        </g>
      </svg>
    </div>
  );
}
