import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Download, Share2, History, MapPin } from "lucide-react";

export const Route = createFileRoute("/relatorio")({
  head: () => ({ meta: [{ title: "Relatório de Vulnerabilidade · PGIIC Pernambuco" }] }),
  component: ReportPage,
});

const score = 73;
const domains = [
  { name: "Físico", v: 68, c: "var(--vuln-4)" },
  { name: "Ambiental", v: 71, c: "var(--vuln-4)" },
  { name: "Climático", v: 82, c: "var(--vuln-5)" },
  { name: "Socioeconômico", v: 65, c: "var(--vuln-4)" },
];

const timeline = [
  { y: 2015, v: 58 }, { y: 2016, v: 59 }, { y: 2017, v: 61 }, { y: 2018, v: 62 },
  { y: 2019, v: 63 }, { y: 2020, v: 64 }, { y: 2021, v: 66 }, { y: 2022, v: 68 },
  { y: 2023, v: 70 }, { y: 2024, v: 71 }, { y: 2025, v: 73 },
];

const indicators = [
  { k: "Recuo da linha de costa (m/ano)", raw: "1,4", norm: 0.92, w: 0.18, dom: "Físico" },
  { k: "Densidade de edificações (un/ha)", raw: "187", norm: 0.81, w: 0.12, dom: "Socioeconômico" },
  { k: "Cota altimétrica média (m)", raw: "2,3", norm: 0.74, w: 0.10, dom: "Físico" },
  { k: "Frequência de ressacas (eventos/ano)", raw: "9", norm: 0.66, w: 0.14, dom: "Climático" },
  { k: "Sensibilidade ambiental (ISA)", raw: "0,71", norm: 0.61, w: 0.09, dom: "Ambiental" },
  { k: "Elevação do NMM projetada (cm)", raw: "+18", norm: 0.78, w: 0.13, dom: "Climático" },
];

function Donut({ value, label }: { value: number; label: string }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const color = value >= 80 ? "var(--vuln-5)" : value >= 65 ? "var(--vuln-4)" : "var(--vuln-3)";
  return (
    <div className="relative size-[200px]">
      <svg viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="14" />
        <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="14"
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">IIVC</div>
        <div className="text-5xl font-semibold font-mono mt-1">{value}</div>
        <div className="text-xs font-mono mt-1" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

function ReportPage() {
  const max = Math.max(...timeline.map((t) => t.v));
  const min = Math.min(...timeline.map((t) => t.v));
  const w = 100, h = 100;
  const points = timeline.map((t, i) => {
    const x = (i / (timeline.length - 1)) * w;
    const y = h - ((t.v - min + 5) / (max - min + 10)) * h;
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;

  return (
    <Shell>
      <div className="space-y-6 max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">// ficha de setor · relatório</div>
            <h1 className="text-2xl font-semibold mt-1">Setor PE-047 — Praia de Boa Viagem</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-teal" />Recife · Pernambuco</span>
              <span>·</span>
              <span className="font-mono">lat −8.1213 / lon −34.8956</span>
              <span>·</span>
              <span className="font-mono">extensão 4,2 km</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-md panel-2 text-sm flex items-center gap-2 hover:border-teal/40"><History className="size-4" />Histórico Completo</button>
            <button className="h-10 px-4 rounded-md panel-2 text-sm flex items-center gap-2 hover:border-teal/40"><Share2 className="size-4" />Compartilhar</button>
            <button className="h-10 px-4 rounded-md bg-teal text-[color:var(--primary-foreground)] text-sm font-semibold flex items-center gap-2"><Download className="size-4" />Exportar PDF</button>
          </div>
        </div>

        {/* Header card */}
        <div className="panel p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="flex justify-center">
            <Donut value={score} label="Classe Alto" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {domains.map((d) => (
                <div key={d.name} className="panel-2 p-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{d.name}</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <div className="text-2xl font-semibold font-mono" style={{ color: d.c }}>{d.v}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">/100</div>
                  </div>
                  <div className="mt-2 h-1.5 rounded bg-[color:var(--surface)]">
                    <div className="h-full rounded" style={{ width: `${d.v}%`, background: d.c }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="panel-2 p-4 text-sm leading-relaxed text-muted-foreground">
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal mb-1">síntese diagnóstica</div>
              Setor urbano densamente ocupado, sob pressão crescente de eventos climáticos extremos. O domínio Climático (82) lidera a vulnerabilidade, com elevação projetada do nível médio do mar em <span className="font-mono text-foreground">+18 cm</span> até 2050. Recuo médio observado de <span className="font-mono text-foreground">1,4 m/ano</span> na linha de costa.
            </div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// evolução temporal</div>
              <h2 className="text-base font-semibold mt-1">Tendência IIVC · 2015 → 2025</h2>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 px-2 h-7 rounded panel-2">Δ +15 pts</div>
              <div className="flex items-center gap-1.5 px-2 h-7 rounded panel-2 text-[color:var(--warn)]">↑ +25,9%</div>
              <div className="flex items-center gap-1.5 px-2 h-7 rounded panel-2">média +1,5 pt/ano</div>
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
              {timeline.map((t) => <span key={t.y}>{t.y}</span>)}
            </div>
            <div className="absolute inset-y-0 -left-8 flex flex-col justify-between text-[10px] font-mono text-muted-foreground py-1">
              <span>80</span><span>70</span><span>60</span><span>50</span>
            </div>
          </div>
        </div>

        {/* Indicators table */}
        <div className="panel p-6">
          <div className="flex items-center justify-between mb-3">
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
              {indicators.map((r) => {
                const contrib = (r.norm * r.w * 100).toFixed(1);
                return (
                  <tr key={r.k} className="border-b border-border/50">
                    <td className="py-3">{r.k}</td>
                    <td className="py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{r.dom}</td>
                    <td className="py-3 text-right font-mono">{r.raw}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded bg-[color:var(--surface-2)]">
                          <div className="h-full rounded bg-gradient-to-r from-teal to-cyan" style={{ width: `${r.norm * 100}%` }} />
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
    </Shell>
  );
}
