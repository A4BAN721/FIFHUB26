export function TriondaBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.88),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),transparent_22%),radial-gradient(circle_at_center,_rgba(239,68,68,0.08),transparent_30%)]" />

      <div className="absolute -right-16 top-0 h-[120vh] w-[120vh] opacity-70">
        <svg viewBox="0 0 1200 1200" className="h-full w-full animate-diagonal-float">
          <defs>
            <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#86efac" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="eagleGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {Array.from({ length: 7 }).map((_, index) => (
            <g key={`pattern-${index}`} transform={`translate(${110 * index}, ${-80 + 140 * index}) scale(${1 - index * 0.08})`}>
              <path
                d="M48 12 L58 46 H94 L62 68 L74 102 L48 80 L22 102 L34 68 L2 46 H38 Z"
                fill="url(#starGradient)"
                opacity="0.8"
              />
              <path
                d="M46 18 C38 26 30 34 28 46 C26 58 34 72 48 86 C62 72 70 58 68 46 C66 34 58 26 50 18 C52 12 44 12 46 18 Z"
                fill="url(#leafGradient)"
                transform="translate(60 40) scale(0.9)"
              />
              <path
                d="M24 12 C12 56 24 72 34 80 C50 90 44 68 62 62 C80 56 72 32 92 24 C74 20 60 22 46 12 Z"
                fill="url(#eagleGradient)"
                transform="translate(120 90) scale(0.85)"
              />
            </g>
          ))}

          <g transform="translate(900 150) rotate(15)">
            <path
              d="M48 12 L58 46 H94 L62 68 L74 102 L48 80 L22 102 L34 68 L2 46 H38 Z"
              fill="url(#starGradient)"
              opacity="0.55"
            />
          </g>

          <g transform="translate(740 320) rotate(-18)">
            <path
              d="M46 18 C38 26 30 34 28 46 C26 58 34 72 48 86 C62 72 70 58 68 46 C66 34 58 26 50 18 C52 12 44 12 46 18 Z"
              fill="url(#leafGradient)"
              opacity="0.55"
            />
          </g>

          <g transform="translate(980 520) rotate(12)">
            <path
              d="M24 12 C12 56 24 72 34 80 C50 90 44 68 62 62 C80 56 72 32 92 24 C74 20 60 22 46 12 Z"
              fill="url(#eagleGradient)"
              opacity="0.55"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
