import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Cpu, Play, CheckCircle2, Clock, GitBranch } from "lucide-react";

export const Route = createFileRoute("/mica")({
  head: () => ({ meta: [{ title: "Motor MICA · PGIIC Pernambuco" }] }),
  component: MicaPage,
});

const domains = ["Físico", "Ambiental", "Climático", "Socioeconômico"];
// Saaty scale-style AHP matrix 5x5 (only 4 used; add Geomorfológico for 5th)
const labels = ["Físico", "Ambiental", "Climático", "Socioecon.", "Geomorf."];
const matrix = [
  [1, 3, 2, 4, 2],
  [1 / 3, 1, 1 / 2, 2, 1],
  [1 / 2, 2, 1, 3, 2],
  [1 / 4, 1 / 2, 1 / 3, 1, 1 / 2],
  [1 / 2, 1, 1 / 2, 2, 1],
];
const weights = [
  { d: "Físico", w: 0.34 },
  { d: "Ambiental", w: 0.18 },
  { d: "Climático", w: 0.27 },
  { d: "Socioeconômico", w: 0.11 },
  { d: "Geomorfológico", w: 0.10 },
];

const history = [
  { id: "#0428", date: "14/05/2026 12:48", v: "MIIC v2.1", status: "Concluído", rc: 0.07 },
  { id: "#0427", date: "12/05/2026 09:14", v: "MIIC v2.1", status: "Concluído", rc: 0.08 },
  { id: "#0426", date: "10/05/2026 18:02", v: "MIIC v2.0", status: "Concluído", rc: 0.06 },
  { id: "#0425", date: "08/05/2026 11:30", v: "MIIC v2.0", status: "Falha", rc: null },
  { id: "#0424", date: "06/05/2026 16:55", v: "MIIC v2.0", status: "Concluído", rc: 0.09 },
];

function cellColor(v: number) {
  // intensity by abs distance from 1
  const intensity = Math.min(1, Math.log2(v >= 1 ? v : 1 / v) / 3);
  if (v === 1) return "color-mix(in oklab, var(--surface-2) 100%, transparent)";
  if (v > 1) return `color-mix(in oklab, var(--teal) ${20 + intensity * 60}%, transparent)`;
  return `color-mix(in oklab, var(--warn) ${20 + intensity * 60}%, transparent)`;
}

function MicaPage() {
  const maxW = Math.max(...weights.map((w) => w.w));
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

        {/* Status row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="panel p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><GitBranch className="size-3" />versão metodológica</div>
            <div className="text-lg font-semibold mt-2">MIIC v2.1</div>
            <div className="text-[10px] font-mono text-muted-foreground">commit · a3f9c2e</div>
          </div>
          <div className="panel p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Clock className="size-3" />último processamento</div>
            <div className="text-lg font-semibold mt-2">há 2 horas</div>
            <div className="text-[10px] font-mono text-muted-foreground">14/05/2026 · 12:48</div>
          </div>
          <div className="panel p-4 border-[color:var(--ok)]/40 bg-[color:var(--ok)]/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--ok)] flex items-center gap-1.5"><CheckCircle2 className="size-3" />razão de consistência</div>
            <div className="text-lg font-semibold mt-2 font-mono">RC = 0,07</div>
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
            <div className="space-y-4">
              {weights.map((w) => (
                <div key={w.d}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{w.d}</span>
                    <span className="font-mono font-semibold">{(w.w * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 mt-1.5 bg-[color:var(--surface-2)] rounded">
                    <div className="h-full rounded bg-gradient-to-r from-teal to-cyan" style={{ width: `${(w.w / maxW) * 100}%` }} />
                  </div>
                </div>
              ))}
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
