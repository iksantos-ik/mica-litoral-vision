import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Cpu, Play, CheckCircle2, Clock, GitBranch, ChevronDown, MapPin } from "lucide-react";

export const Route = createFileRoute("/mica")({
  head: () => ({ meta: [{ title: "Motor MICA · PGIIC Pernambuco" }] }),
  component: MicaPage,
});

const labels = ["Físico", "Ambiental", "Climático", "Socioecon.", "Geomorf."];
const matrix = [
  [1, 3, 2, 4, 2],
  [1 / 3, 1, 1 / 2, 2, 1],
  [1 / 2, 2, 1, 3, 2],
  [1 / 4, 1 / 2, 1 / 3, 1, 1 / 2],
  [1 / 2, 1, 1 / 2, 2, 1],
];

const weights = [
  { d: "Físico", key: "fisico", w: 0.34 },
  { d: "Ambiental", key: "ambiental", w: 0.18 },
  { d: "Climático", key: "climatico", w: 0.27 },
  { d: "Socioeconômico", key: "socio", w: 0.11 },
  { d: "Geomorfológico", key: "geo", w: 0.10 },
];

type Ind = { code: string; name: string; type: "Automático" | "Campo" | "Calculado MICA"; source: string; unit: string };
const indicators: Record<string, Ind[]> = {
  fisico: [
    { code: "FG-01", name: "Taxa de erosão / acreção", type: "Automático", source: "MapBiomas/INPE", unit: "m/ano" },
    { code: "FG-02", name: "Largura da faixa de praia", type: "Campo", source: "GPS diferencial", unit: "m" },
    { code: "FG-03", name: "Tipo de substrato predominante", type: "Campo", source: "Classificação sedimentar", unit: "Classe (1–5)" },
    { code: "FG-04", name: "Declividade da face praial", type: "Campo", source: "Perfis transversais", unit: "Grau (°)" },
    { code: "FG-05", name: "Presença de estruturas de contenção", type: "Automático", source: "OSM + Base Estadual PE", unit: "% extensão" },
    { code: "FG-06", name: "Variação do volume sedimentar", type: "Campo", source: "Perfil praial", unit: "m³/m" },
  ],
  ambiental: [
    { code: "AE-01", name: "Cobertura de manguezal", type: "Automático", source: "MapBiomas Água", unit: "%" },
    { code: "AE-02", name: "Presença de recifes de coral", type: "Campo", source: "Mergulho / drone", unit: "%" },
    { code: "AE-03", name: "Cobertura de restinga", type: "Automático", source: "MapBiomas", unit: "%" },
    { code: "AE-04", name: "Proximidade a áreas protegidas", type: "Automático", source: "IBGE / ICMBio", unit: "km/score" },
    { code: "AE-05", name: "Qualidade da água costeira", type: "Campo", source: "Análise laboratorial", unit: "% não conformidade" },
    { code: "AE-06", name: "Sensibilidade ecológica integrada", type: "Calculado MICA", source: "AE-01 a AE-05", unit: "Score 0–100" },
  ],
  climatico: [
    { code: "CH-01", name: "Altura significativa de ondas", type: "Automático", source: "PNBOIA/DHN", unit: "m" },
    { code: "CH-02", name: "Regime de ventos dominantes", type: "Automático", source: "INMET", unit: "m/s" },
    { code: "CH-03", name: "Variação do nível do mar", type: "Automático", source: "DHN/PSMSL", unit: "mm/ano" },
    { code: "CH-04", name: "Projeção SLR", type: "Automático", source: "INPE/PBMC", unit: "cm/score" },
    { code: "CH-05", name: "Frequência de eventos extremos", type: "Automático", source: "INMET + históricos", unit: "eventos/ano" },
    { code: "CH-06", name: "Cota de inundação costeira", type: "Campo", source: "Levantamento altimétrico", unit: "m AMSL" },
  ],
  socio: [
    { code: "ST-01", name: "Densidade populacional costeira", type: "Automático", source: "IBGE Censo 2022", unit: "hab./km²" },
    { code: "ST-02", name: "Valor imobiliário exposto", type: "Automático", source: "IPTU / Base estadual", unit: "% do valor total" },
    { code: "ST-03", name: "Infraestrutura crítica exposta", type: "Automático", source: "OSM + Base Estadual PE", unit: "% em risco" },
    { code: "ST-04", name: "Uso e ocupação do solo costeiro", type: "Automático", source: "MapBiomas", unit: "%" },
    { code: "ST-05", name: "Índice de vulnerabilidade social", type: "Automático", source: "IBGE/CadÚnico", unit: "%" },
    { code: "ST-06", name: "Regularidade fundiária costeira", type: "Campo", source: "Vistoria + cartório", unit: "%" },
  ],
};

const sectorOptions = [
  { id: "PE-008", name: "Praia de Maria Farinha", mun: "Paulista", rc: 0.06, last: "há 1 hora", lastDate: "15/05/2026 · 17:48" },
  { id: "PE-019", name: "Praia de Piedade", mun: "Jaboatão dos Guararapes", rc: 0.09, last: "há 6 horas", lastDate: "15/05/2026 · 12:48" },
  { id: "PE-031", name: "Praia do Paiva", mun: "Cabo de Santo Agostinho", rc: 0.08, last: "há 4 horas", lastDate: "15/05/2026 · 14:48" },
  { id: "PE-047", name: "Praia de Boa Viagem", mun: "Recife", rc: 0.07, last: "há 2 horas", lastDate: "15/05/2026 · 16:48" },
  { id: "PE-062", name: "Porto de Galinhas", mun: "Ipojuca", rc: 0.08, last: "há 3 horas", lastDate: "15/05/2026 · 15:48" },
  { id: "PE-078", name: "Praia de Tamandaré", mun: "Tamandaré", rc: 0.07, last: "há 5 horas", lastDate: "15/05/2026 · 13:48" },
];

const history = [
  { id: "#0428", date: "14/05/2026 12:48", v: "MIIC v2.1", status: "Concluído", rc: 0.07 },
  { id: "#0427", date: "12/05/2026 09:14", v: "MIIC v2.1", status: "Concluído", rc: 0.08 },
  { id: "#0426", date: "10/05/2026 18:02", v: "MIIC v2.0", status: "Concluído", rc: 0.06 },
  { id: "#0425", date: "08/05/2026 11:30", v: "MIIC v2.0", status: "Falha", rc: null },
  { id: "#0424", date: "06/05/2026 16:55", v: "MIIC v2.0", status: "Concluído", rc: 0.09 },
];

function cellColor(v: number) {
  const intensity = Math.min(1, Math.log2(v >= 1 ? v : 1 / v) / 3);
  if (v === 1) return "color-mix(in oklab, var(--surface-2) 100%, transparent)";
  if (v > 1) return `color-mix(in oklab, var(--teal) ${20 + intensity * 60}%, transparent)`;
  return `color-mix(in oklab, var(--warn) ${20 + intensity * 60}%, transparent)`;
}

function typeBadge(t: Ind["type"]) {
  if (t === "Automático")
    return "border-cyan/40 bg-cyan/15 text-cyan";
  if (t === "Campo")
    return "border-[color:var(--warn)]/40 bg-[color:var(--warn)]/15 text-[color:var(--warn)]";
  return "border-purple-400/40 bg-purple-400/15 text-purple-300";
}

function MicaPage() {
  const maxW = Math.max(...weights.map((w) => w.w));
  const [sectorId, setSectorId] = useState("PE-047");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fadeKey, setFadeKey] = useState(0);

  const sector = sectorOptions.find((s) => s.id === sectorId)!;

  const selectSector = (id: string) => {
    setSectorId(id);
    setOpenDropdown(false);
    setFadeKey((k) => k + 1);
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">// motor analítico</div>
            <h1 className="text-2xl font-semibold mt-1 flex items-center gap-3">
              <Cpu className="size-6 text-teal" />
              Motor Integrado Costeiro Analítico — MICA
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Núcleo computacional baseado no método AHP de Saaty para integração ponderada de domínios físicos, ambientais, climáticos e socioeconômicos.
            </p>
          </div>
          <button className="h-11 px-5 rounded-md bg-teal text-[color:var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 glow-teal">
            <Play className="size-4 fill-current" /> Executar Análise
          </button>
        </div>

        {/* Sector selector */}
        <div className="panel px-4 py-3 flex items-center gap-4 flex-wrap">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <MapPin className="size-3.5 text-teal" />
            // setor de análise
          </div>
          <div className="relative ml-auto min-w-[320px]">
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
              <div className="absolute z-20 right-0 left-0 mt-1.5 panel p-1 animate-fade-in max-h-80 overflow-auto">
                {sectorOptions.map((s) => (
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

        {/* Status row */}
        <div key={fadeKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
          <div className="panel p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><GitBranch className="size-3" />versão metodológica</div>
            <div className="text-lg font-semibold mt-2">MIIC v2.1</div>
            <div className="text-[10px] font-mono text-muted-foreground">commit · a3f9c2e</div>
          </div>
          <div className="panel p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Clock className="size-3" />último processamento</div>
            <div className="text-lg font-semibold mt-2">{sector.last}</div>
            <div className="text-[10px] font-mono text-muted-foreground">{sector.lastDate}</div>
          </div>
          <div className="panel p-4 border-[color:var(--ok)]/40 bg-[color:var(--ok)]/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--ok)] flex items-center gap-1.5"><CheckCircle2 className="size-3" />razão de consistência</div>
            <div className="text-lg font-semibold mt-2 font-mono">RC = {sector.rc.toFixed(2).replace(".", ",")}</div>
            <div className="text-[10px] font-mono text-[color:var(--ok)]">aprovado · limite ≤ 0,10</div>
          </div>
          <div className="panel p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">setores processados</div>
            <div className="text-lg font-semibold mt-2 font-mono">342 / 342</div>
            <div className="text-[10px] font-mono text-muted-foreground">cobertura · 100%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* AHP matrix */}
          <div className="panel p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// matriz ahp 5×5</div>
                <h2 className="text-base font-semibold mt-1">Comparação par-a-par entre domínios</h2>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">escala Saaty · 1/9 → 9</div>
            </div>
            <div className="overflow-auto">
              <table className="w-full border-separate border-spacing-1 text-xs font-mono">
                <thead>
                  <tr>
                    <th className="w-24"></th>
                    {labels.map((l) => (
                      <th key={l} className="text-[10px] uppercase tracking-wider text-muted-foreground font-normal py-1">{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="text-[10px] uppercase tracking-wider text-muted-foreground pr-2 text-right">{labels[i]}</td>
                      {row.map((v, j) => (
                        <td key={j}
                            className="h-12 text-center rounded border border-border tabular-nums"
                            style={{ background: cellColor(v), color: i === j ? "var(--muted-foreground)" : "var(--foreground)" }}>
                          {v >= 1 ? v.toFixed(0) : `1/${Math.round(1 / v)}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: "color-mix(in oklab, var(--teal) 60%, transparent)" }} />maior importância</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[color:var(--surface-2)]" />igual</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: "color-mix(in oklab, var(--warn) 60%, transparent)" }} />menor importância</span>
              <span className="ml-auto">λmax = 5,31 · IC = 0,078 · IR = 1,12</span>
            </div>
          </div>

          {/* Weights */}
          <div className="panel p-5 lg:col-span-2">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// pesos derivados</div>
            <h2 className="text-base font-semibold mt-1 mb-4">Distribuição por domínio</h2>
            <div className="space-y-2">
              {weights.map((w) => {
                const isOpen = expanded === w.key;
                const inds = indicators[w.key];
                const auto = inds?.filter((i) => i.type === "Automático").length ?? 0;
                const field = inds?.filter((i) => i.type === "Campo").length ?? 0;
                return (
                  <div key={w.d}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : w.key)}
                      className={`w-full text-left p-2 -m-2 rounded transition-colors ${isOpen ? "bg-cyan/5" : "hover:bg-[color:var(--surface-2)]/40"}`}
                    >
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-cyan" : ""}`} />
                          {w.d}
                        </span>
                        <span className="font-mono font-semibold">{(w.w * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2.5 mt-1.5 bg-[color:var(--surface-2)] rounded">
                        <div
                          className="h-full rounded transition-all duration-200"
                          style={{
                            width: `${(w.w / maxW) * 100}%`,
                            background: isOpen
                              ? "linear-gradient(to right, var(--cyan), var(--teal))"
                              : "linear-gradient(to right, var(--teal), var(--cyan))",
                            filter: isOpen ? "brightness(1.25)" : "none",
                          }}
                        />
                      </div>
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-[250ms] ease-out"
                      style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}
                    >
                      <div className="panel-2 mt-2 p-3">
                        {w.key === "geo" ? (
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            Os indicadores geomorfológicos são derivados do domínio Físico-Geomorfológico.
                            Consulte <span className="text-teal font-mono">FG-01</span> a <span className="text-teal font-mono">FG-06</span> para detalhamento.
                          </div>
                        ) : (
                          <>
                            <table className="w-full text-[11px]">
                              <thead className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                                <tr className="border-b border-border">
                                  <th className="text-left py-1.5 font-normal">Código</th>
                                  <th className="text-left py-1.5 font-normal">Indicador</th>
                                  <th className="text-left py-1.5 font-normal">Tipo</th>
                                  <th className="text-left py-1.5 font-normal">Fonte</th>
                                  <th className="text-left py-1.5 font-normal">Unidade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inds.map((i) => (
                                  <tr key={i.code} className="border-b border-border/40">
                                    <td className="py-1.5 font-mono text-teal whitespace-nowrap">{i.code}</td>
                                    <td className="py-1.5 pr-2">{i.name}</td>
                                    <td className="py-1.5">
                                      <span className={`inline-flex items-center px-1.5 h-5 rounded text-[9px] font-mono uppercase tracking-wider border whitespace-nowrap ${typeBadge(i.type)}`}>
                                        {i.type}
                                      </span>
                                    </td>
                                    <td className="py-1.5 text-muted-foreground text-[10px]">{i.source}</td>
                                    <td className="py-1.5 font-mono text-muted-foreground text-[10px] whitespace-nowrap">{i.unit}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="mt-3 pt-2 border-t border-border text-[10px] font-mono text-muted-foreground">
                              {auto} automáticos · {field} de campo
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-border text-[10px] font-mono text-muted-foreground">
              Σ pesos = 1,000 · normalizado por autovetor principal
            </div>
          </div>
        </div>

        {/* History */}
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// histórico de execuções</div>
              <h2 className="text-base font-semibold mt-1">Últimas 5 rodadas do motor</h2>
            </div>
            <button className="text-[10px] font-mono uppercase tracking-wider text-teal">Ver tudo →</button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left py-2 font-normal">ID</th>
                <th className="text-left py-2 font-normal">Data / Hora</th>
                <th className="text-left py-2 font-normal">Versão</th>
                <th className="text-left py-2 font-normal">RC</th>
                <th className="text-left py-2 font-normal">Status</th>
                <th className="text-right py-2 font-normal">Ações</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => {
                const ok = h.status === "Concluído";
                return (
                  <tr key={h.id} className="border-b border-border/60 hover:bg-[color:var(--surface-2)]/40">
                    <td className="py-3 font-mono text-teal">{h.id}</td>
                    <td className="py-3 font-mono text-muted-foreground">{h.date}</td>
                    <td className="py-3 font-mono">{h.v}</td>
                    <td className="py-3 font-mono">{h.rc !== null ? h.rc.toFixed(2) : "—"}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 h-6 rounded text-[10px] font-mono uppercase tracking-wider border ${
                        ok ? "border-[color:var(--ok)]/40 bg-[color:var(--ok)]/10 text-[color:var(--ok)]" :
                             "border-[color:var(--danger)]/40 bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
                      }`}>
                        <span className={`size-1.5 rounded-full ${ok ? "bg-[color:var(--ok)]" : "bg-[color:var(--danger)]"}`} />
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[10px] font-mono text-muted-foreground">log · diff · reproduzir</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
