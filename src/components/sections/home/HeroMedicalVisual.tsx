export default function HeroMedicalVisual() {
  return (
    <svg
      className="thea-hero__illustration"
      viewBox="0 0 480 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="thea-bottle-fill" x1="35%" y1="0%" x2="65%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="50%" stopColor="rgba(215,235,245,0.28)" />
          <stop offset="100%" stopColor="rgba(190,220,235,0.12)" />
        </linearGradient>
        <linearGradient id="thea-container-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ecfc0" />
          <stop offset="100%" stopColor="#4db8a8" />
        </linearGradient>
        <filter id="thea-object-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#1a3a4a" floodOpacity="0.14" />
        </filter>
      </defs>

      {/* Surgical tubing ring on white base */}
      <g filter="url(#thea-object-shadow)" transform="translate(24 268)">
        <ellipse cx="88" cy="118" rx="78" ry="16" fill="#ffffff" />
        <ellipse cx="88" cy="112" rx="72" ry="13" fill="#f5f8fa" />
        <ellipse cx="88" cy="88" rx="52" ry="52" fill="none" stroke="#5ec4b8" strokeWidth="22" />
        <ellipse cx="88" cy="88" rx="52" ry="52" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="8" />
        <ellipse cx="72" cy="72" rx="10" ry="22" fill="rgba(255,255,255,0.25)" />
      </g>

      {/* Medical bottle */}
      <g filter="url(#thea-object-shadow)" transform="translate(158 108)">
        <rect x="72" y="0" width="36" height="14" rx="5" fill="#f0f4f8" />
        <rect x="78" y="-10" width="24" height="12" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={80 + i * 4.5}
            y1="-8"
            x2={80 + i * 4.5}
            y2="-2"
            stroke="#d1d9e0"
            strokeWidth="1"
          />
        ))}
        <path
          d="M28 14 H152 C158 14 162 18 162 24 V318 C162 334 150 346 136 346 H44 C30 346 18 334 18 318 V24 C18 18 22 14 28 14 Z"
          fill="url(#thea-bottle-fill)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
        />
        <path
          d="M36 64 H144 V318 C144 328 136 334 128 334 H52 C44 334 36 328 36 318 Z"
          fill="rgba(180,220,235,0.15)"
        />
        <ellipse cx="90" cy="160" rx="16" ry="48" fill="rgba(255,255,255,0.22)" />
        <ellipse cx="76" cy="120" rx="7" ry="28" fill="rgba(255,255,255,0.32)" />
        <path d="M42 36 H138" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Clinical storage container */}
      <g filter="url(#thea-object-shadow)" transform="translate(296 198)">
        <rect x="16" y="48" width="120" height="138" rx="16" fill="url(#thea-container-fill)" />
        <rect x="16" y="48" width="120" height="32" rx="16" fill="rgba(255,255,255,0.12)" />
        <path
          d="M52 48 H100 C110 48 120 38 120 26 V20 C120 10 110 0 100 0 H52 C42 0 32 10 32 20 V26 C32 38 42 48 52 48 Z"
          fill="#ffffff"
        />
        <rect x="64" y="-8" width="24" height="14" rx="5" fill="#ffffff" />
        <rect x="28" y="82" width="96" height="52" rx="6" fill="rgba(255,255,255,0.92)" />
        <ellipse cx="76" cy="96" rx="28" ry="8" fill="rgba(94,196,184,0.12)" />
      </g>
    </svg>
  );
}
