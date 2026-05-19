// Stylized SVG of the Pernambuco coastline divided into vulnerability segments.
export type Sector = {
  id: string;
  name: string;
  municipality: string;
  zone: string;
  iivc: number;
  cls: 1 | 2 | 3 | 4 | 5;
  className: "Muito Baixo" | "Baixo" | "Moderado" | "Alto" | "Muito Alto";
  delta: number;
  variables: { k: string; v: number }[];
  d: string;
  labelAt: [number, number];
};

const vulnColors = [
  "var(--vuln-1)",
  "var(--vuln-2)",
  "var(--vuln-3)",
  "var(--vuln-4)",
  "var(--vuln-5)",
];

export const sectors: Sector[] = [
  {
    id: "PE-008", name: "Praia de Maria Farinha", municipality: "Paulista",
    zone: "zona urbana litorânea", iivc: 44, cls: 2, className: "Baixo", delta: 1.1,
    variables: [
      { k: "Cobertura de restinga", v: 0.55 },
      { k: "Taxa de erosão", v: 0.48 },
      { k: "Densidade populacional", v: 0.41 },
      { k: "Frequência de ressacas", v: 0.38 },
    ],
    d: "M120 70 C 170 85, 220 100, 270 120",
    labelAt: [275, 118],
  },
  {
    id: "PE-019", name: "Praia de Piedade", municipality: "Jaboatão dos Guararapes",
    zone: "zona urbana costeira", iivc: 61, cls: 4, className: "Alto", delta: 3.8,
    variables: [
      { k: "Taxa de erosão", v: 0.85 },
      { k: "Densidade populacional", v: 0.79 },
      { k: "Altura de ondas", v: 0.71 },
      { k: "Infraestrutura exposta", v: 0.63 },
    ],
    d: "M270 120 C 310 140, 340 165, 360 195",
    labelAt: [368, 198],
  },
  {
    id: "PE-031", name: "Praia do Paiva", municipality: "Cabo de Santo Agostinho",
    zone: "zona de expansão urbana", iivc: 58, cls: 3, className: "Moderado", delta: 2.5,
    variables: [
      { k: "Cobertura de manguezal", v: 0.88 },
      { k: "Infraestrutura exposta", v: 0.72 },
      { k: "Uso do solo", v: 0.65 },
      { k: "Proximidade a UC", v: 0.61 },
    ],
    d: "M360 195 C 372 235, 376 275, 372 315",
    labelAt: [382, 318],
  },
  {
    id: "PE-047", name: "Praia de Boa Viagem", municipality: "Recife",
    zone: "zona urbana costeira", iivc: 73, cls: 4, className: "Alto", delta: 4.2,
    variables: [
      { k: "Recuo da linha de costa", v: 0.92 },
      { k: "Densidade de edificações", v: 0.81 },
      { k: "Cota altimétrica média", v: 0.74 },
      { k: "Frequência de ressacas", v: 0.66 },
    ],
    d: "M372 315 C 366 355, 358 395, 348 430",
    labelAt: [358, 432],
  },
  {
    id: "PE-062", name: "Porto de Galinhas", municipality: "Ipojuca",
    zone: "zona turística costeira", iivc: 51, cls: 3, className: "Moderado", delta: 1.9,
    variables: [
      { k: "Presença de recifes", v: 0.77 },
      { k: "Uso turístico do solo", v: 0.69 },
      { k: "Altura de ondas", v: 0.58 },
      { k: "Vulnerabilidade social", v: 0.52 },
    ],
    d: "M348 430 C 322 475, 290 510, 250 545",
    labelAt: [260, 548],
  },
  {
    id: "PE-078", name: "Praia de Tamandaré", municipality: "Tamandaré",
    zone: "zona de proteção ambiental", iivc: 82, cls: 5, className: "Muito Alto", delta: 5.7,
    variables: [
      { k: "Taxa de erosão", v: 0.94 },
      { k: "Vulnerabilidade social", v: 0.89 },
      { k: "Infraestrutura exposta", v: 0.83 },
      { k: "Frequência de ressacas", v: 0.78 },
    ],
    d: "M250 545 C 200 595, 150 650, 110 720",
    labelAt: [120, 722],
  },
];

export function CoastMap({
  active,
  onSelect,
  hidden,
  hiddenClasses,
}: {
  active?: string;
  onSelect?: (id: string) => void;
  hidden?: boolean;
  hiddenClasses?: number[];
}) {
  return (
    <svg viewBox="0 0 500 880" className="w-full h-full" preserveAspectRatio="xMidYMid meet" overflow="visible">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="oklch(1 0 0 / 0.04)" strokeWidth="1" />
        </pattern>
        <linearGradient id="ocean" x1="500" x2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="oklch(0.32 0.06 220 / 0.4)" />
          <stop offset="1" stopColor="oklch(0.20 0.04 240 / 0)" />
        </linearGradient>
      </defs>
      <rect x="-3000" y="-3000" width="6000" height="6000" fill="url(#grid)" />
      <path
        d="M-3000 -3000 L 110 -3000 L 110 0 C 170 60, 250 90, 320 130 C 380 180, 380 280, 350 380 C 330 460, 260 520, 180 600 C 120 680, 80 780, 70 880 L 70 3000 L -3000 3000 Z"
        fill="oklch(0.24 0.04 250)"
        stroke="oklch(1 0 0 / 0.06)"
      />
      <rect x="380" y="-3000" width="3000" height="6000" fill="url(#ocean)" />

      {!hidden && sectors.filter(s => !hiddenClasses?.includes(s.cls)).map((s) => {
        const isActive = active === s.id;
        const color = vulnColors[s.cls - 1];
        return (
          <g
            key={s.id}
            className="cursor-pointer group"
            onClick={() => onSelect?.(s.id)}
            style={{ transition: "opacity 200ms" }}
          >
            {/* hit area */}
            <path d={s.d} stroke="transparent" strokeWidth="22" fill="none" strokeLinecap="round" />
            {/* halo when active or hover */}
            <path
              d={s.d}
              stroke={isActive ? "var(--cyan)" : color}
              strokeWidth={isActive ? 16 : 14}
              fill="none"
              strokeLinecap="round"
              opacity={isActive ? 0.35 : 0}
              className="group-hover:opacity-30"
              style={{ transition: "opacity 150ms, stroke-width 150ms" }}
            />
            <path
              d={s.d}
              stroke={color}
              strokeWidth={isActive ? 7 : 5}
              fill="none"
              strokeLinecap="round"
              opacity={isActive ? 1 : 0.95}
            />
            {isActive && (
              <path d={s.d} stroke="var(--cyan)" strokeWidth="2" fill="none"
                strokeLinecap="round" strokeDasharray="3 3" opacity="0.7" />
            )}
          </g>
        );
      })}

      {!hidden && sectors.filter(s => !hiddenClasses?.includes(s.cls)).map((s) => {
        const isActive = active === s.id;
        const [x, y] = s.labelAt;
        return (
          <g
            key={"l" + s.id}
            transform={`translate(${x + 18}, ${y - 4})`}
            className="cursor-pointer pointer-events-none"
          >
            <line x1="-16" y1="6" x2="-2" y2="6"
              stroke={isActive ? "var(--cyan)" : "oklch(1 0 0 / 0.3)"} />
            <rect
              x="-2" y="-4" width="78" height="22" rx="3"
              fill={isActive ? "color-mix(in oklab, var(--cyan) 15%, var(--surface))" : "var(--surface)"}
              stroke={isActive ? "var(--cyan)" : "oklch(1 0 0 / 0.15)"}
              style={{ transition: "all 150ms" }}
            />
            <text x="3" y="6" fontSize="9" fontFamily="monospace"
              fill={isActive ? "var(--cyan)" : "oklch(0.96 0.01 240)"}>{s.id}</text>
            <text x="3" y="15" fontSize="8" fill="oklch(0.7 0.02 240)">
              {s.name.replace("Praia de ", "").replace("Praia do ", "").slice(0, 16)}
            </text>
          </g>
        );
      })}

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
