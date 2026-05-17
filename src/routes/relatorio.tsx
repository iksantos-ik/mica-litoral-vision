import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/Shell";
import { Download, Share2, History, MapPin, ChevronDown, FileText, FileStack, Check, X, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/relatorio")({
  head: () => ({ meta: [{ title: "Relatório de Vulnerabilidade · PGIIC Pernambuco" }] }),
  component: ReportPage,
});

type SectorData = {
  id: string;
  name: string;
  mun: string;
  lat: string;
  lon: string;
  ext: string;
  iivc: number;
  klass: string;
  domains: { name: string; v: number }[];
  diagnosis: string;
  indicators: { k: string; raw: string; norm: number; w: number; dom: string }[];
  timeline: { y: number; v: number }[];
};

function colorFor(v: number) {
  if (v >= 80) return "var(--vuln-5)";
  if (v >= 65) return "var(--vuln-4)";
  if (v >= 50) return "var(--vuln-3)";
  if (v >= 35) return "var(--vuln-2)";
  return "var(--vuln-1)";
}

function genTimeline(target: number): { y: number; v: number }[] {
  // Build a plausible 2015-2025 trend ending at target
  const start = Math.max(20, target - 15);
  const arr: { y: number; v: number }[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    // ease-out curve
    const v = Math.round(start + (target - start) * (1 - Math.pow(1 - t, 1.6)));
    arr.push({ y: 2015 + i, v });
  }
  return arr;
}

const sectors: SectorData[] = [
  {
    id: "PE-008", name: "Praia de Maria Farinha", mun: "Paulista",
    lat: "−7.8821", lon: "−34.8456", ext: "3,1 km",
    iivc: 44, klass: "Classe Baixo",
    domains: [
      { name: "Físico", v: 41 }, { name: "Ambiental", v: 38 },
      { name: "Climático", v: 49 }, { name: "Socioeconômico", v: 47 },
    ],
    diagnosis: "Setor com vulnerabilidade moderada a baixa, caracterizado por cobertura de restinga preservada e baixa densidade de ocupação. Taxa de erosão controlada e frequência de ressacas abaixo da média estadual.",
    indicators: [
      { k: "Cobertura de restinga (%)", raw: "62", norm: 0.28, w: 0.09, dom: "Ambiental" },
      { k: "Recuo da linha de costa (m/ano)", raw: "0,3", norm: 0.35, w: 0.18, dom: "Físico" },
      { k: "Densidade de edificações (un/ha)", raw: "42", norm: 0.41, w: 0.12, dom: "Socioeconômico" },
      { k: "Frequência de ressacas (eventos/ano)", raw: "3", norm: 0.38, w: 0.14, dom: "Climático" },
      { k: "Elevação do NMM projetada (cm)", raw: "+12", norm: 0.52, w: 0.13, dom: "Climático" },
      { k: "Cota altimétrica média (m)", raw: "4,8", norm: 0.32, w: 0.10, dom: "Físico" },
    ],
    timeline: genTimeline(44),
  },
  {
    id: "PE-019", name: "Praia de Piedade", mun: "Jaboatão dos Guararapes",
    lat: "−8.1654", lon: "−34.9012", ext: "2,8 km",
    iivc: 61, klass: "Classe Alto",
    domains: [
      { name: "Físico", v: 63 }, { name: "Ambiental", v: 58 },
      { name: "Climático", v: 67 }, { name: "Socioeconômico", v: 55 },
    ],
    diagnosis: "Setor urbano com pressão crescente de ocupação e taxa de erosão significativa. Infraestrutura de drenagem insuficiente amplia a exposição a eventos de ressaca. Domínio Climático lidera com elevação projetada de +16 cm até 2050.",
    indicators: [
      { k: "Recuo da linha de costa (m/ano)", raw: "1,1", norm: 0.74, w: 0.18, dom: "Físico" },
      { k: "Elevação do NMM projetada (cm)", raw: "+16", norm: 0.71, w: 0.13, dom: "Climático" },
      { k: "Frequência de ressacas (eventos/ano)", raw: "7", norm: 0.62, w: 0.14, dom: "Climático" },
      { k: "Densidade de edificações (un/ha)", raw: "152", norm: 0.72, w: 0.12, dom: "Socioeconômico" },
      { k: "Cota altimétrica média (m)", raw: "2,9", norm: 0.65, w: 0.10, dom: "Físico" },
      { k: "Sensibilidade ambiental (ISA)", raw: "0,58", norm: 0.54, w: 0.09, dom: "Ambiental" },
    ],
    timeline: genTimeline(61),
  },
  {
    id: "PE-031", name: "Praia do Paiva", mun: "Cabo de Santo Agostinho",
    lat: "−8.2934", lon: "−34.9567", ext: "5,4 km",
    iivc: 58, klass: "Classe Moderado",
    domains: [
      { name: "Físico", v: 54 }, { name: "Ambiental", v: 72 },
      { name: "Climático", v: 61 }, { name: "Socioeconômico", v: 44 },
    ],
    diagnosis: "Setor em expansão urbana com expressiva cobertura de manguezal remanescente. Alta sensibilidade ambiental combina com crescimento imobiliário acelerado. Domínio Ambiental lidera com cobertura ecossistêmica ameaçada.",
    indicators: [
      { k: "Sensibilidade ambiental (ISA)", raw: "0,82", norm: 0.84, w: 0.09, dom: "Ambiental" },
      { k: "Cobertura de manguezal (%)", raw: "38", norm: 0.72, w: 0.10, dom: "Ambiental" },
      { k: "Crescimento imobiliário (%/ano)", raw: "8,4", norm: 0.71, w: 0.12, dom: "Socioeconômico" },
      { k: "Recuo da linha de costa (m/ano)", raw: "0,9", norm: 0.58, w: 0.18, dom: "Físico" },
      { k: "Elevação do NMM projetada (cm)", raw: "+15", norm: 0.66, w: 0.13, dom: "Climático" },
      { k: "Frequência de ressacas (eventos/ano)", raw: "6", norm: 0.55, w: 0.14, dom: "Climático" },
    ],
    timeline: genTimeline(58),
  },
  {
    id: "PE-047", name: "Praia de Boa Viagem", mun: "Recife",
    lat: "−8.1213", lon: "−34.8956", ext: "4,2 km",
    iivc: 73, klass: "Classe Alto",
    domains: [
      { name: "Físico", v: 68 }, { name: "Ambiental", v: 71 },
      { name: "Climático", v: 82 }, { name: "Socioeconômico", v: 65 },
    ],
    diagnosis: "Setor urbano densamente ocupado, sob pressão crescente de eventos climáticos extremos. O domínio Climático (82) lidera a vulnerabilidade, com elevação projetada do nível médio do mar em +18 cm até 2050. Recuo médio observado de 1,4 m/ano na linha de costa.",
    indicators: [
      { k: "Recuo da linha de costa (m/ano)", raw: "1,4", norm: 0.92, w: 0.18, dom: "Físico" },
      { k: "Densidade de edificações (un/ha)", raw: "187", norm: 0.81, w: 0.12, dom: "Socioeconômico" },
      { k: "Cota altimétrica média (m)", raw: "2,3", norm: 0.74, w: 0.10, dom: "Físico" },
      { k: "Frequência de ressacas (eventos/ano)", raw: "9", norm: 0.66, w: 0.14, dom: "Climático" },
      { k: "Sensibilidade ambiental (ISA)", raw: "0,71", norm: 0.61, w: 0.09, dom: "Ambiental" },
      { k: "Elevação do NMM projetada (cm)", raw: "+18", norm: 0.78, w: 0.13, dom: "Climático" },
    ],
    timeline: genTimeline(73),
  },
  {
    id: "PE-062", name: "Porto de Galinhas", mun: "Ipojuca",
    lat: "−8.5021", lon: "−35.0134", ext: "6,1 km",
    iivc: 51, klass: "Classe Moderado",
    domains: [
      { name: "Físico", v: 48 }, { name: "Ambiental", v: 66 },
      { name: "Climático", v: 55 }, { name: "Socioeconômico", v: 38 },
    ],
    diagnosis: "Setor turístico com presença significativa de recifes de coral. Alta sensibilidade ambiental e pressão de uso turístico intensivo. Risco moderado com tendência de crescimento associada à expansão da infraestrutura hoteleira.",
    indicators: [
      { k: "Presença de recifes de coral (%)", raw: "44", norm: 0.71, w: 0.09, dom: "Ambiental" },
      { k: "Pressão turística (visitantes/km²)", raw: "1.240", norm: 0.68, w: 0.12, dom: "Socioeconômico" },
      { k: "Sensibilidade ambiental (ISA)", raw: "0,68", norm: 0.62, w: 0.09, dom: "Ambiental" },
      { k: "Frequência de ressacas (eventos/ano)", raw: "5", norm: 0.48, w: 0.14, dom: "Climático" },
      { k: "Recuo da linha de costa (m/ano)", raw: "0,6", norm: 0.44, w: 0.18, dom: "Físico" },
      { k: "Elevação do NMM projetada (cm)", raw: "+14", norm: 0.58, w: 0.13, dom: "Climático" },
    ],
    timeline: genTimeline(51),
  },
  {
    id: "PE-078", name: "Praia de Tamandaré", mun: "Tamandaré",
    lat: "−8.7543", lon: "−35.1089", ext: "3,9 km",
    iivc: 82, klass: "Classe Muito Alto",
    domains: [
      { name: "Físico", v: 79 }, { name: "Ambiental", v: 74 },
      { name: "Climático", v: 91 }, { name: "Socioeconômico", v: 77 },
    ],
    diagnosis: "Setor em estado crítico de vulnerabilidade costeira. Taxa de erosão acelerada de 2,1 m/ano, combinada com alta vulnerabilidade social e infraestrutura exposta insuficiente. Requer intervenção prioritária e plano de adaptação climática urgente.",
    indicators: [
      { k: "Recuo da linha de costa (m/ano)", raw: "2,1", norm: 0.96, w: 0.18, dom: "Físico" },
      { k: "Elevação do NMM projetada (cm)", raw: "+22", norm: 0.91, w: 0.13, dom: "Climático" },
      { k: "Frequência de ressacas (eventos/ano)", raw: "12", norm: 0.88, w: 0.14, dom: "Climático" },
      { k: "Índice de vulnerabilidade social", raw: "0,77", norm: 0.82, w: 0.12, dom: "Socioeconômico" },
      { k: "Cota altimétrica média (m)", raw: "1,6", norm: 0.84, w: 0.10, dom: "Físico" },
      { k: "Sensibilidade ambiental (ISA)", raw: "0,74", norm: 0.71, w: 0.09, dom: "Ambiental" },
    ],
    timeline: genTimeline(82),
  },
];

function Donut({ value, label }: { value: number; label: string }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const color = colorFor(value);
  return (
    <div className="relative size-[200px]">
      <svg viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="14" />
        <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="14"
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: "stroke-dashoffset 400ms ease, stroke 400ms ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">IIVC</div>
        <div className="text-5xl font-semibold font-mono mt-1">{value}</div>
        <div className="text-xs font-mono mt-1" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

/*
  ESTRUTURA DE CONTEÚDO DOS RELATÓRIOS (referência para geração futura em PDF)

  --- RELATÓRIO EXECUTIVO (2 páginas) ---
  Página 1: Cabeçalho institucional (logo PGIC + OLCP + data) · Identificação do setor
            (código, nome, município, coordenadas, extensão) · Mapa principal com classificação IIVC
            · Gauge IIVC com classe e variação · 4 scores de domínio · Síntese diagnóstica
  Página 2: Top 5 indicadores críticos (nome, valor, fonte, unidade) · Gráfico de tendência
            IIVC 2015–2025 · Tabela de fontes dos dados · Rodapé com metadados: versão MIIC,
            data processamento, RC, commit metodológico

  --- RELATÓRIO TÉCNICO COMPLETO (8–12 páginas) ---
  Seção 1 — Identificação e localização do setor
  Seção 2 — Resumo executivo (igual às 2 páginas do executivo)
  Seção 3 — Detalhamento dos indicadores por domínio: tabela com todos os 24 indicadores,
            código, nome, numerador, denominador, valor calculado, fonte e periodicidade
  Seção 4 — Metodologia MICA: explicação do processo AHP, matriz de comparação par a par,
            cálculo da razão de consistência (RC), normalização dos dados, pipeline em 6 etapas
  Seção 5 — Memória de cálculo: valores brutos, normalizados e ponderados por indicador e domínio
  Seção 6 — Série histórica: tabela e gráfico de IIVC por ano de 2015 a 2025
  Seção 7 — Referências técnicas: ABNT NBR, PBMC/IPCC, AHP (Saaty 1980), MapBiomas, IBGE, DHN,
            INMET, ICMBio, Lei 7.661/88, CONAMA 357/2005, Decreto 5.300/2004
  Seção 8 — Glossário: IIVC, MIIC, AHP, RC, SLR, setor costeiro, linha de costa, acreção, erosão
*/

function ReportPage() {
  const [sectorId, setSectorId] = useState("PE-047");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [version, setVersion] = useState<"exec" | "tec">("exec");
  const [generating, setGenerating] = useState(false);

  const sector = sectors.find((s) => s.id === sectorId)!;

  const selectSector = (id: string) => {
    setSectorId(id);
    setOpenDropdown(false);
    setFadeKey((k) => k + 1);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const label = version === "exec" ? "Executivo" : "Técnico Completo";
    try {
      const [{ default: jsPDF }, autoTableMod] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const autoTable = (autoTableMod as any).default ?? (autoTableMod as any);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const now = new Date().toLocaleString("pt-BR");

      // Header band
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 70, "F");
      doc.setTextColor(94, 234, 212);
      doc.setFontSize(9);
      doc.text("PGIIC · PLATAFORMA GEOESPACIAL INTEGRADA DE INTELIGÊNCIA COSTEIRA", 40, 28);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(`Relatório ${label} — ${sector.id}`, 40, 52);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text(`${sector.name}`, 40, 100);
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Município: ${sector.mun}  ·  Lat ${sector.lat}  ·  Lon ${sector.lon}  ·  Extensão ${sector.ext}`, 40, 118);
      doc.text(`Emitido em: ${now}`, 40, 134);

      // IIVC box
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(40, 150, 200, 80, 6, 6, "S");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text("IIVC — Índice Integrado", 52, 170);
      doc.setFontSize(32);
      doc.setTextColor(15, 23, 42);
      doc.text(String(sector.iivc), 52, 208);
      doc.setFontSize(10);
      doc.setTextColor(15, 118, 110);
      doc.text(sector.klass, 120, 208);

      // Domains table
      autoTable(doc, {
        startY: 250,
        head: [["Domínio", "Valor normalizado"]],
        body: sector.domains.map((d) => [d.name, String(d.v)]),
        theme: "grid",
        headStyles: { fillColor: [15, 23, 42], textColor: 255 },
        styles: { fontSize: 10 },
      });

      let y = (doc as any).lastAutoTable.finalY + 24;
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("Síntese diagnóstica", 40, y);
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(sector.diagnosis, pageW - 80);
      doc.text(lines, 40, y + 16);
      y = y + 16 + lines.length * 13 + 16;

      // Timeline table
      autoTable(doc, {
        startY: y,
        head: [["Ano", "IIVC"]],
        body: sector.timeline.map((t) => [String(t.y), String(t.v)]),
        theme: "striped",
        headStyles: { fillColor: [13, 148, 136], textColor: 255 },
        styles: { fontSize: 9 },
      });

      if (version === "tec") {
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Indicadores técnicos — composição AHP", 40, 60);
        autoTable(doc, {
          startY: 80,
          head: [["Indicador", "Valor bruto", "Normalizado", "Peso", "Domínio"]],
          body: sector.indicators.map((i) => [i.k, i.raw, i.norm.toFixed(2), i.w.toFixed(2), i.dom]),
          theme: "grid",
          headStyles: { fillColor: [15, 23, 42], textColor: 255 },
          styles: { fontSize: 9 },
        });
      }

      const filename = `PGIIC_${sector.id}_${version === "exec" ? "Executivo" : "Tecnico"}.pdf`;
      doc.save(filename);

      setGenerating(false);
      setModalOpen(false);
      toast.success(`Relatório ${label} gerado para ${sector.name}`, {
        duration: 4000,
        icon: <CheckCircle2 className="size-4 text-cyan" />,
      });
    } catch (e) {
      setGenerating(false);
      toast.error("Falha ao gerar o relatório.");
    }
  };

  const max = Math.max(...sector.timeline.map((t) => t.v));
  const min = Math.min(...sector.timeline.map((t) => t.v));
  const w = 100, h = 100;
  const points = sector.timeline.map((t, i) => {
    const x = (i / (sector.timeline.length - 1)) * w;
    const y = h - ((t.v - min + 5) / (max - min + 10)) * h;
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;

  const delta = sector.timeline[sector.timeline.length - 1].v - sector.timeline[0].v;
  const pctDelta = ((delta / sector.timeline[0].v) * 100).toFixed(1);
  const avgPerYear = (delta / (sector.timeline.length - 1)).toFixed(1);

  return (
    <Shell>
      <div className="space-y-6 max-w-[1400px]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">// ficha de setor · relatório</div>
        </div>

        {/* Sector selector — same pattern as MICA */}
        <div className="panel px-4 py-3 flex items-center gap-4 flex-wrap relative z-40">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <MapPin className="size-3.5 text-teal" />
            // setor de análise
          </div>
          <div className="relative ml-auto min-w-[340px]">
            <button
              onClick={() => setOpenDropdown((o) => !o)}
              className={`w-full h-10 px-3 rounded-md panel-2 border flex items-center justify-between text-sm transition-colors ${
                openDropdown ? "border-cyan text-cyan" : "border-border hover:border-cyan/40"
              }`}
            >
              <span className="font-mono">
                <span className={openDropdown ? "text-cyan" : "text-teal"}>{sector.id}</span>
                <span className="text-foreground"> · {sector.name}</span>
                <span className="text-muted-foreground"> — {sector.mun}</span>
              </span>
              <ChevronDown className={`size-4 transition-transform duration-200 ${openDropdown ? "rotate-180 text-cyan" : "text-muted-foreground"}`} />
            </button>
            {openDropdown && (
              <div className="absolute z-50 right-0 left-0 mt-1.5 panel p-1 animate-fade-in max-h-80 overflow-auto shadow-2xl bg-[color:var(--surface)]">
                {sectors.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectSector(s.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 hover:bg-[color:var(--surface-2)] ${
                      s.id === sectorId ? "bg-cyan/10" : ""
                    }`}
                  >
                    <span className="font-mono text-teal">{s.id}</span>
                    <span>· {s.name}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{s.mun}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div key={fadeKey} className="animate-fade-in space-y-6" style={{ animationDuration: "200ms" }}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Setor {sector.id} — {sector.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-teal" />{sector.mun} · Pernambuco</span>
                <span>·</span>
                <span className="font-mono">lat {sector.lat} / lon {sector.lon}</span>
                <span>·</span>
                <span className="font-mono">extensão {sector.ext}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-10 px-4 rounded-md panel-2 text-sm flex items-center gap-2 hover:border-teal/40"><History className="size-4" />Histórico Completo</button>
              <button className="h-10 px-4 rounded-md panel-2 text-sm flex items-center gap-2 hover:border-teal/40"><Share2 className="size-4" />Compartilhar</button>
              <button
                onClick={() => setModalOpen(true)}
                className="h-10 px-4 rounded-md bg-teal text-[color:var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Download className="size-4" />Exportar PDF
              </button>
            </div>
          </div>

          {/* Header card */}
          <div className="panel p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
            <div className="flex justify-center">
              <Donut value={sector.iivc} label={sector.klass} />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sector.domains.map((d) => {
                  const c = colorFor(d.v);
                  return (
                    <div key={d.name} className="panel-2 p-4">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{d.name}</div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <div className="text-2xl font-semibold font-mono" style={{ color: c }}>{d.v}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">/100</div>
                      </div>
                      <div className="mt-2 h-1.5 rounded bg-[color:var(--surface)]">
                        <div className="h-full rounded transition-all duration-500" style={{ width: `${d.v}%`, background: c }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="panel-2 p-4 text-sm leading-relaxed text-muted-foreground">
                <div className="text-[10px] font-mono uppercase tracking-wider text-teal mb-1">síntese diagnóstica</div>
                {sector.diagnosis}
              </div>
            </div>
          </div>

          {/* Trend chart */}
          <div className="panel p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// evolução temporal</div>
                <h2 className="text-base font-semibold mt-1">Tendência IIVC · 2015 → 2025</h2>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 px-2 h-7 rounded panel-2">Δ {delta >= 0 ? "+" : ""}{delta} pts</div>
                <div className="flex items-center gap-1.5 px-2 h-7 rounded panel-2 text-[color:var(--warn)]">↑ {pctDelta}%</div>
                <div className="flex items-center gap-1.5 px-2 h-7 rounded panel-2">média {avgPerYear} pt/ano</div>
              </div>
            </div>
            <div className="relative h-[260px]">
              <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--teal)" stopOpacity="0.45" />
                    <stop offset="1" stopColor="var(--teal)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 25, 50, 75, 100].map((y) => (
                  <line key={y} x1="0" y1={y} x2={w} y2={y} stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.2" />
                ))}
                <path d={area} fill="url(#g)" />
                <path d={path} fill="none" stroke="var(--teal)" strokeWidth="0.6" />
                {points.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="0.9" fill="var(--background)" stroke="var(--teal)" strokeWidth="0.4" />
                ))}
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-mono text-muted-foreground -mb-5">
                {sector.timeline.map((t) => <span key={t.y}>{t.y}</span>)}
              </div>
            </div>
          </div>

          {/* Indicators table */}
          <div className="panel p-6">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// indicadores dominantes</div>
                <h2 className="text-base font-semibold mt-1">Maior contribuição para o IIVC do setor</h2>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">6 de 32 indicadores · ordenados por contribuição</span>
            </div>
            <table className="w-full text-sm">
              <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-normal">Indicador</th>
                  <th className="text-left py-2 font-normal">Domínio</th>
                  <th className="text-right py-2 font-normal">Valor bruto</th>
                  <th className="text-left py-2 font-normal w-[30%]">Valor normalizado</th>
                  <th className="text-right py-2 font-normal">Peso</th>
                  <th className="text-right py-2 font-normal">Contrib.</th>
                </tr>
              </thead>
              <tbody>
                {sector.indicators.map((r) => {
                  const contrib = (r.norm * r.w * 100).toFixed(1);
                  return (
                    <tr key={r.k} className="border-b border-border/50">
                      <td className="py-3">{r.k}</td>
                      <td className="py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{r.dom}</td>
                      <td className="py-3 text-right font-mono">{r.raw}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded bg-[color:var(--surface-2)]">
                            <div className="h-full rounded bg-gradient-to-r from-teal to-cyan transition-all duration-500" style={{ width: `${r.norm * 100}%` }} />
                          </div>
                          <span className="font-mono text-xs w-10 text-right">{r.norm.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono">{r.w.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono text-teal">{contrib}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <footer className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border pt-4">
            <div>Relatório gerado em 14/05/2026 · MICA ciclo #0428 · MIIC v2.1</div>
            <div>Documento institucional · classificação: público</div>
          </footer>
        </div>
      </div>

      {/* Export Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !generating && setModalOpen(false)}
        >
          <div
            className="panel max-w-4xl w-full p-6 shadow-2xl bg-[color:var(--surface)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => !generating && setModalOpen(false)}
              className="absolute top-4 right-4 size-8 rounded-md hover:bg-[color:var(--surface-2)] flex items-center justify-center text-muted-foreground"
              disabled={generating}
            >
              <X className="size-4" />
            </button>

            <div className="mb-5">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">// exportar relatório</div>
              <h2 className="text-xl font-semibold mt-1">Selecionar versão do relatório</h2>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Setor <span className="text-teal">{sector.id}</span> · {sector.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Executive */}
              <button
                onClick={() => setVersion("exec")}
                disabled={generating}
                className={`text-left panel-2 p-5 border-2 transition-all ${
                  version === "exec" ? "border-cyan bg-cyan/5" : "border-border hover:border-cyan/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`size-10 rounded-md flex items-center justify-center ${version === "exec" ? "bg-cyan/15 text-cyan" : "bg-[color:var(--surface)] text-muted-foreground"}`}>
                    <FileText className="size-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-border bg-[color:var(--surface)]">2 páginas</span>
                </div>
                <h3 className="text-base font-semibold mt-3">Relatório Executivo</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Síntese estratégica com mapa principal, índice IIVC, scores por domínio e principais indicadores. Formatado para apresentação a gestores e tomadores de decisão.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs">
                  {[
                    "Mapa do setor com classificação IIVC",
                    "Gauge e scores por domínio",
                    "Top 5 indicadores críticos com valores e fontes",
                    "Síntese diagnóstica",
                    "Fontes dos dados utilizados",
                    "Metadados: versão MIIC, data, RC",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="size-3.5 text-cyan shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </button>

              {/* Option 2: Technical */}
              <button
                onClick={() => setVersion("tec")}
                disabled={generating}
                className={`text-left panel-2 p-5 border-2 transition-all ${
                  version === "tec" ? "border-cyan bg-cyan/5" : "border-border hover:border-cyan/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`size-10 rounded-md flex items-center justify-center ${version === "tec" ? "bg-cyan/15 text-cyan" : "bg-[color:var(--surface)] text-muted-foreground"}`}>
                    <FileStack className="size-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-border bg-[color:var(--surface)]">8–12 páginas</span>
                </div>
                <h3 className="text-base font-semibold mt-3">Relatório Técnico Completo</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Documentação técnica completa com detalhamento metodológico, memória de cálculo, série histórica e referências científicas. Adequado para processos de licenciamento e auditoria.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs">
                  {[
                    "Tudo do Relatório Executivo",
                    "Detalhamento dos 24 indicadores (numerador/denominador)",
                    "Matriz AHP com pesos e razão de consistência",
                    "Série histórica IIVC 2015–2025 com gráfico",
                    "Memória de cálculo completa por domínio",
                    "Como funciona o Motor MICA",
                    "Referências técnicas e científicas",
                    "Glossário de termos e siglas",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="size-3.5 text-cyan shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-5 border-t border-border">
              <button
                onClick={() => setModalOpen(false)}
                disabled={generating}
                className="h-10 px-4 rounded-md panel-2 text-sm hover:border-border/60 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="h-10 px-5 rounded-md bg-cyan text-[color:var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-70"
              >
                {generating ? (
                  <><Loader2 className="size-4 animate-spin" /> Gerando...</>
                ) : (
                  <><Download className="size-4" /> Gerar Relatório</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
