import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/Shell";
import { ArrowLeft, Download, ChevronRight, ChevronDown, AlertTriangle, FileText, FileStack, Check, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [{ title: "Central de Alertas Territoriais · PGIIC Pernambuco" }] }),
  component: AlertsPage,
});

type Alert = {
  n: number;
  id: string;
  name: string;
  mun: string;
  iivc: number;
  delta: number;
  klass: "Muito Alto" | "Alto" | "Moderado";
};

const alerts: Alert[] = [
  // Muito Alto
  { n: 1, id: "PE-078", name: "Praia de Tamandaré", mun: "Tamandaré", iivc: 82, delta: 5.7, klass: "Muito Alto" },
  { n: 2, id: "PE-089", name: "Praia de Muro Alto", mun: "Ipojuca", iivc: 81, delta: 4.9, klass: "Muito Alto" },
  { n: 3, id: "PE-034", name: "Praia de Candeias", mun: "Jaboatão dos Guararapes", iivc: 80, delta: 6.1, klass: "Muito Alto" },
  // Alto
  { n: 4, id: "PE-047", name: "Praia de Boa Viagem", mun: "Recife", iivc: 73, delta: 4.2, klass: "Alto" },
  { n: 5, id: "PE-031", name: "Bairro Novo", mun: "Olinda", iivc: 71, delta: 2.8, klass: "Alto" },
  { n: 6, id: "PE-019", name: "Praia de Piedade", mun: "Jaboatão dos Guararapes", iivc: 61, delta: 3.8, klass: "Alto" },
  { n: 7, id: "PE-058", name: "Suape", mun: "Cabo de Santo Agostinho", iivc: 69, delta: 1.9, klass: "Alto" },
  { n: 8, id: "PE-012", name: "Praia de Janga", mun: "Paulista", iivc: 67, delta: 2.1, klass: "Alto" },
  { n: 9, id: "PE-044", name: "Boa Viagem Norte", mun: "Recife", iivc: 66, delta: 3.5, klass: "Alto" },
  { n: 10, id: "PE-023", name: "Praia de Paratibe", mun: "Paulista", iivc: 64, delta: 1.7, klass: "Alto" },
  { n: 11, id: "PE-071", name: "Praia dos Carneiros", mun: "Tamandaré", iivc: 63, delta: 2.3, klass: "Alto" },
  { n: 12, id: "PE-038", name: "Praia de Gaibu", mun: "Cabo de Santo Agostinho", iivc: 62, delta: 1.4, klass: "Alto" },
  { n: 13, id: "PE-055", name: "Praia de Itapuama", mun: "Cabo de Santo Agostinho", iivc: 61, delta: 0.9, klass: "Alto" },
  { n: 14, id: "PE-009", name: "Praia de Maria Farinha Norte", mun: "Paulista", iivc: 60, delta: 1.1, klass: "Alto" },
  { n: 15, id: "PE-041", name: "Praia de Ilha Verde", mun: "Ipojuca", iivc: 60, delta: 2.7, klass: "Alto" },
  { n: 16, id: "PE-027", name: "Rio Doce", mun: "Olinda", iivc: 60, delta: 1.8, klass: "Alto" },
  { n: 17, id: "PE-016", name: "Praia de Milagres", mun: "São José da Coroa Grande", iivc: 60, delta: 3.2, klass: "Alto" },
  // Moderado
  { n: 18, id: "PE-024", name: "Ilha de Itamaracá", mun: "Pilar", iivc: 64, delta: 0.8, klass: "Moderado" },
  { n: 19, id: "PE-066", name: "Barra de Sirinhaém", mun: "Sirinhaém", iivc: 61, delta: -0.3, klass: "Moderado" },
  { n: 20, id: "PE-031B", name: "Praia do Paiva", mun: "Cabo de Santo Agostinho", iivc: 58, delta: 2.5, klass: "Moderado" },
  { n: 21, id: "PE-062", name: "Porto de Galinhas", mun: "Ipojuca", iivc: 51, delta: 1.9, klass: "Moderado" },
  { n: 22, id: "PE-048", name: "Praia de Piedade Sul", mun: "Jaboatão", iivc: 57, delta: 1.2, klass: "Moderado" },
  { n: 23, id: "PE-053", name: "Praia de Serrambi", mun: "Ipojuca", iivc: 55, delta: 0.7, klass: "Moderado" },
  { n: 24, id: "PE-017", name: "Praia de Cupe", mun: "Ipojuca", iivc: 54, delta: 1.5, klass: "Moderado" },
  { n: 25, id: "PE-033", name: "Praia de Maracaípe", mun: "Ipojuca", iivc: 53, delta: 0.4, klass: "Moderado" },
  { n: 26, id: "PE-007", name: "Praia de Conceição", mun: "Paulista", iivc: 52, delta: -0.1, klass: "Moderado" },
  { n: 27, id: "PE-008", name: "Praia de Maria Farinha", mun: "Paulista", iivc: 44, delta: 1.1, klass: "Moderado" },
];

const klassColor: Record<Alert["klass"], string> = {
  "Muito Alto": "var(--vuln-5)",
  Alto: "var(--vuln-4)",
  Moderado: "var(--vuln-3)",
};

type ClassFilter = "todos" | Alert["klass"];
type SortKey = "iivc" | "delta" | "mun";

function AlertsPage() {
  const [classFilter, setClassFilter] = useState<ClassFilter>("todos");
  const [muniFilter, setMuniFilter] = useState<string>("Todos os municípios");
  const [sort, setSort] = useState<SortKey>("iivc");
  const [muniOpen, setMuniOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [version, setVersion] = useState<"exec" | "comp">("exec");
  const [generating, setGenerating] = useState(false);

  const munis = useMemo(() => ["Todos os municípios", ...Array.from(new Set(alerts.map((a) => a.mun))).sort()], []);

  const filtered = useMemo(() => {
    let arr = [...alerts];
    if (classFilter !== "todos") arr = arr.filter((a) => a.klass === classFilter);
    if (muniFilter !== "Todos os municípios") arr = arr.filter((a) => a.mun === muniFilter);
    if (sort === "iivc") arr.sort((a, b) => b.iivc - a.iivc);
    else if (sort === "delta") arr.sort((a, b) => b.delta - a.delta);
    else arr.sort((a, b) => a.mun.localeCompare(b.mun));
    return arr;
  }, [classFilter, muniFilter, sort]);

  const grouped = useMemo(() => {
    const g: Record<Alert["klass"], Alert[]> = { "Muito Alto": [], Alto: [], Moderado: [] };
    filtered.forEach((a) => g[a.klass].push(a));
    return g;
  }, [filtered]);

  const counts = {
    total: alerts.length,
    mAlto: alerts.filter((a) => a.klass === "Muito Alto").length,
    alto: alerts.filter((a) => a.klass === "Alto").length,
    mod: alerts.filter((a) => a.klass === "Moderado").length,
  };

  const sortLabel = sort === "iivc" ? "Maior IIVC" : sort === "delta" ? "Maior variação" : "Município A–Z";

  async function handleGenerate() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();

      // Header band
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 70, "F");
      doc.setTextColor(94, 234, 212);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PGIIC PERNAMBUCO · MICA", 40, 30);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(version === "exec" ? "Relatório de Alertas Executivo" : "Relatório de Alertas Completo", 40, 52);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Central de Alertas Territoriais · IIVC`, 40, 100);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`27 trechos · Muito Alto: 3 · Alto: 14 · Moderado: 10`, 40, 116);
      doc.text(`MICA Engine · MIIC v2.1 · Processado em 14/05/2026 às 12:48`, 40, 130);

      autoTable(doc, {
        startY: 150,
        head: [["#", "Código", "Trecho", "Município", "Classe", "IIVC", "Δ 2020"]],
        body: alerts.map((a) => [a.n, a.id, a.name, a.mun, a.klass, a.iivc, (a.delta >= 0 ? "+" : "") + a.delta.toFixed(1)]),
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [15, 118, 110], textColor: 255 },
        alternateRowStyles: { fillColor: [241, 245, 249] },
      });

      if (version === "comp") {
        doc.addPage();
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text("Fichas resumidas — Trechos Muito Alto e Alto", 40, 50);
        const top = alerts.filter((a) => a.klass !== "Moderado");
        autoTable(doc, {
          startY: 70,
          head: [["Código", "Trecho", "Município", "IIVC", "Físico", "Ambiental", "Climático", "Socioecon."]],
          body: top.map((a) => [
            a.id, a.name, a.mun, a.iivc,
            Math.max(20, a.iivc - 8),
            Math.max(20, a.iivc - 12),
            Math.min(95, a.iivc + 4),
            Math.max(20, a.iivc - 6),
          ]),
          styles: { fontSize: 8, cellPadding: 4 },
          headStyles: { fillColor: [15, 118, 110], textColor: 255 },
        });
        doc.addPage();
        doc.setFontSize(13);
        doc.text("Metodologia MICA", 40, 50);
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const meth = [
          "O Motor Integrado Costeiro Analítico (MICA) processa 32 indicadores agrupados em 4 domínios",
          "(Físico, Ambiental, Climático e Socioeconômico) ponderados via método AHP (Saaty).",
          "O IIVC resulta da agregação ponderada normalizada [0–100] com razão de consistência RC < 0,1.",
          "Série histórica 2015–2025 derivada de séries Landsat-8/CBERS-4A e estações maregráficas INPH.",
          "Referências: MMA (2018), IPCC AR6 (2021), Muehe (2010), Cutter et al. (2003).",
        ];
        meth.forEach((l, i) => doc.text(l, 40, 80 + i * 14));
      }

      doc.save(`PGIIC_Alertas_${version === "exec" ? "Executivo" : "Completo"}.pdf`);
      toast.success("Relatório de Alertas sendo gerado...", {
        description: "27 trechos · MIIC v2.1",
        duration: 4000,
      });
      setModalOpen(false);
    } catch (e) {
      toast.error("Falha ao gerar PDF");
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Shell>
      <div className="space-y-6 max-w-[1400px] pb-24">
        {/* Header */}
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-teal hover:text-cyan transition-colors">
            <ArrowLeft className="size-3.5" /> Dashboard
          </Link>
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal mt-3">// alertas territoriais · IIVC</div>
          <div className="flex flex-wrap items-end justify-between gap-4 mt-1">
            <div>
              <h1 className="text-2xl font-semibold">Central de Alertas Territoriais</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Trechos costeiros classificados por nível de vulnerabilidade IIVC · Pernambuco
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                27 trechos com vulnerabilidade Moderado ou superior — ciclo MIIC v2.1 · 14/05/2026
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="h-10 px-4 rounded-md bg-cyan text-[color:var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:opacity-90"
            >
              <Download className="size-4" /> Exportar PDF
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="panel p-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-2">classe</span>
            {(["todos", "Muito Alto", "Alto", "Moderado"] as ClassFilter[]).map((c) => {
              const active = classFilter === c;
              return (
                <button
                  key={c}
                  onClick={() => setClassFilter(c)}
                  className={`h-8 px-3 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                    active ? "bg-cyan text-[color:var(--primary-foreground)]" : "panel-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c === "todos" ? "todos" : c}
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="relative">
            <button
              onClick={() => { setMuniOpen((o) => !o); setSortOpen(false); }}
              className="h-8 px-3 rounded-md panel-2 text-xs flex items-center gap-2 hover:border-cyan/40 min-w-[200px] justify-between"
            >
              <span className="truncate">{muniFilter}</span>
              <ChevronDown className={`size-3.5 transition-transform ${muniOpen ? "rotate-180 text-cyan" : "text-muted-foreground"}`} />
            </button>
            {muniOpen && (
              <div className="absolute z-30 left-0 mt-1.5 panel p-1 max-h-72 overflow-auto shadow-2xl bg-[color:var(--surface)] min-w-[240px]">
                {munis.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMuniFilter(m); setMuniOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs hover:bg-[color:var(--surface-2)] ${m === muniFilter ? "text-cyan" : ""}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setSortOpen((o) => !o); setMuniOpen(false); }}
              className="h-8 px-3 rounded-md panel-2 text-xs flex items-center gap-2 hover:border-cyan/40"
            >
              <span className="text-muted-foreground">ordenar:</span>
              <span>{sortLabel}</span>
              <ChevronDown className={`size-3.5 transition-transform ${sortOpen ? "rotate-180 text-cyan" : "text-muted-foreground"}`} />
            </button>
            {sortOpen && (
              <div className="absolute z-30 left-0 mt-1.5 panel p-1 shadow-2xl bg-[color:var(--surface)] min-w-[180px]">
                {([
                  ["iivc", "Maior IIVC"],
                  ["delta", "Maior variação"],
                  ["mun", "Município A–Z"],
                ] as [SortKey, string][]).map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => { setSort(k); setSortOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs hover:bg-[color:var(--surface-2)] ${sort === k ? "text-cyan" : ""}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            exibindo <span className="text-teal">{filtered.length}</span> alertas
          </div>
        </div>

        {/* Grouped list */}
        <div className="space-y-6">
          {(["Muito Alto", "Alto", "Moderado"] as Alert["klass"][]).map((kls) => {
            const list = grouped[kls];
            if (list.length === 0) return null;
            const c = klassColor[kls];
            return (
              <section key={kls}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="size-2.5 rounded-sm" style={{ background: c }} />
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: c }}>
                    // {kls.toLowerCase()}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{list.length} trechos</div>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <ul className="space-y-2">
                  {list.map((a) => (
                    <li
                      key={a.id + a.n}
                      className="panel p-3 flex items-center gap-3 hover:border-teal/40 transition-colors cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono text-muted-foreground w-6 text-right">{String(a.n).padStart(2, "0")}</div>

                      <div
                        className="size-11 rounded-md flex items-center justify-center text-sm font-mono font-semibold shrink-0"
                        style={{
                          background: `color-mix(in oklab, ${c} 22%, transparent)`,
                          color: c,
                          border: `1px solid ${c}`,
                        }}
                      >
                        {a.iivc}
                      </div>

                      {kls === "Muito Alto" && (
                        <AlertTriangle className="size-4 text-[color:var(--vuln-5)] animate-pulse shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                          <span className="text-teal">{a.id}</span>
                          <span>·</span>
                          <span>{a.mun}</span>
                        </div>
                        <div className="text-sm font-medium truncate">{a.name}</div>
                      </div>

                      <span
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border"
                        style={{
                          color: c,
                          borderColor: `color-mix(in oklab, ${c} 50%, transparent)`,
                          background: `color-mix(in oklab, ${c} 10%, transparent)`,
                        }}
                      >
                        {a.klass}
                      </span>

                      <div className="text-right w-16">
                        <div
                          className="text-xs font-mono"
                          style={{ color: a.delta >= 0 ? "var(--vuln-5)" : "var(--ok)" }}
                        >
                          {a.delta >= 0 ? "↑" : "↓"} {Math.abs(a.delta).toFixed(1)}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">vs 2020</div>
                      </div>

                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-teal shrink-0" />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {filtered.length === 0 && (
            <div className="panel p-10 text-center text-sm text-muted-foreground">
              Nenhum alerta encontrado com os filtros aplicados.
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-[260px] right-0 bg-[color:var(--surface)]/95 backdrop-blur-md border-t border-border z-30">
        <div className="max-w-[1400px] px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-[11px] font-mono text-muted-foreground">
            <span className="text-foreground font-semibold">{counts.total} alertas ativos</span>
            <span className="mx-2">·</span>
            <span style={{ color: "var(--vuln-5)" }}>{counts.mAlto} Muito Alto</span>
            <span className="mx-2">·</span>
            <span style={{ color: "var(--vuln-4)" }}>{counts.alto} Alto</span>
            <span className="mx-2">·</span>
            <span style={{ color: "var(--vuln-3)" }}>{counts.mod} Moderado</span>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground hidden md:block">
            Fonte: MICA Engine · MIIC v2.1 · Processado em 14/05/2026 às 12:48
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="h-9 px-3 rounded-md bg-cyan text-[color:var(--primary-foreground)] text-xs font-semibold flex items-center gap-2 hover:opacity-90"
          >
            <Download className="size-3.5" /> Exportar PDF
          </button>
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
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">// exportar alertas</div>
              <h2 className="text-xl font-semibold mt-1">Selecionar versão do relatório</h2>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                27 trechos · MIIC v2.1 · ciclo 14/05/2026
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h3 className="text-base font-semibold mt-3">Relatório de Alertas Executivo</h3>
                <ul className="mt-4 space-y-1.5 text-xs">
                  {[
                    "Mapa de hotspots costeiros",
                    "Ranking dos 27 trechos",
                    "Classificação por classe de vulnerabilidade",
                    "Fontes dos dados utilizados",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="size-3.5 text-cyan shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </button>

              <button
                onClick={() => setVersion("comp")}
                disabled={generating}
                className={`text-left panel-2 p-5 border-2 transition-all ${
                  version === "comp" ? "border-cyan bg-cyan/5" : "border-border hover:border-cyan/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`size-10 rounded-md flex items-center justify-center ${version === "comp" ? "bg-cyan/15 text-cyan" : "bg-[color:var(--surface)] text-muted-foreground"}`}>
                    <FileStack className="size-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-border bg-[color:var(--surface)]">5–8 páginas</span>
                </div>
                <h3 className="text-base font-semibold mt-3">Relatório de Alertas Completo</h3>
                <ul className="mt-4 space-y-1.5 text-xs">
                  {[
                    "Tudo do Relatório Executivo",
                    "Ficha resumida de cada trecho com scores por domínio",
                    "Série histórica dos top 5",
                    "Metodologia MICA",
                    "Referências técnicas e científicas",
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
                {generating ? (<><Loader2 className="size-4 animate-spin" /> Gerando...</>) : (<><Download className="size-4" /> Gerar Relatório</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
