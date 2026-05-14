// Stylized SVG of the Pernambuco coastline divided into vulnerability segments.
const vulnColors = [
  "var(--vuln-1)",
  "var(--vuln-2)",
  "var(--vuln-3)",
  "var(--vuln-4)",
  "var(--vuln-5)",
];

const segments = [
  { id: "PE-012", name: "Goiana", cls: 2, d: "M120 60 C 180 70, 230 80, 280 95" },
  { id: "PE-024", name: "Itamaracá", cls: 3, d: "M280 95 C 320 110, 350 130, 370 160" },
  { id: "PE-031", name: "Olinda", cls: 4, d: "M370 160 C 380 200, 380 240, 370 280" },
  { id: "PE-047", name: "Boa Viagem", cls: 5, d: "M370 280 C 360 320, 350 360, 340 400" },
  { id: "PE-058", name: "Cabo de Sto. Agostinho", cls: 4, d: "M340 400 C 320 440, 290 470, 260 500" },
  { id: "PE-066", name: "Sirinhaém", cls: 3, d: "M260 500 C 220 530, 180 560, 150 600" },
  { id: "PE-079", name: "Tamandaré", cls: 2, d: "M150 600 C 120 640, 100 680, 90 720" },
  { id: "PE-088", name: "São José da Coroa Grande", cls: 1, d: "M90 720 C 80 760, 75 790, 80 820" },
];

export function CoastMap({ active }: { active?: string }) {
  return (
    <svg viewBox="0 0 500 880" className="w-full h-full">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="oklch(1 0 0 / 0.04)" strokeWidth="1" />
        </pattern>
        <linearGradient id="ocean" x1="1" x2="0">
          <stop offset="0" stopColor="oklch(0.32 0.06 220 / 0.4)" />
          <stop offset="1" stopColor="oklch(0.20 0.04 240 / 0)" />
        </linearGradient>
      </defs>
      <rect width="500" height="880" fill="url(#grid)" />
      {/* land mass */}
      <path
        d="M0 0 L 110 0 C 170 60, 250 90, 320 130 C 380 180, 380 280, 350 380 C 330 460, 260 520, 180 600 C 120 680, 80 780, 70 880 L 0 880 Z"
        fill="oklch(0.24 0.04 250)"
        stroke="oklch(1 0 0 / 0.06)"
      />
      {/* ocean wash */}
      <rect x="380" y="0" width="120" height="880" fill="url(#ocean)" />
      {/* segments */}
      {segments.map((s) => {
        const isActive = active === s.id;
        return (
          <g key={s.id}>
            <path
              d={s.d}
              stroke={vulnColors[s.cls - 1]}
              strokeWidth={isActive ? 7 : 5}
              fill="none"
              strokeLinecap="round"
              opacity={isActive ? 1 : 0.95}
            />
            {isActive && (
              <path d={s.d} stroke={vulnColors[s.cls - 1]} strokeWidth="14" fill="none"
                strokeLinecap="round" opacity="0.25" />
            )}
          </g>
        );
      })}
      {/* labels for top critical */}
      {segments.filter((s) => s.cls >= 4).map((s, i) => {
        const [, , x, y] = s.d.split(/[ ,C]/).slice(-4).map(Number);
        return (
          <g key={"l" + s.id} transform={`translate(${x + 20}, ${y - 8})`}>
            <line x1="-18" y1="6" x2="-2" y2="6" stroke="oklch(1 0 0 / 0.3)" />
            <text fontSize="10" fill="oklch(0.96 0.01 240)" fontFamily="monospace">{s.id}</text>
            <text y="12" fontSize="9" fill="oklch(0.7 0.02 240)">{s.name}</text>
          </g>
        );
      })}
      {/* compass */}
      <g transform="translate(440, 40)" fontFamily="monospace" fontSize="9" fill="oklch(0.7 0.02 240)">
        <circle r="14" fill="none" stroke="oklch(1 0 0 / 0.2)" />
        <text x="-3" y="-18">N</text>
        <path d="M0 -10 L4 8 L0 4 L-4 8 Z" fill="var(--teal)" />
      </g>
    </svg>
  );
}

export const vulnLegend = [
  { cls: 1, label: "Muito Baixo" },
  { cls: 2, label: "Baixo" },
  { cls: 3, label: "Moderado" },
  { cls: 4, label: "Alto" },
  { cls: 5, label: "Muito Alto" },
];
