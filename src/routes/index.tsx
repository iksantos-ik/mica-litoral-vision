import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { CoastMap, vulnLegend } from "@/components/CoastMap";
import { ArrowUpRight, ArrowDownRight, Activity, AlertTriangle, Clock, MapPin, ChevronRight, Expand } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Executivo · PGIIC Pernambuco" },
      { name: "description", content: "Painel executivo da Plataforma Geoespacial Integrada de Inteligência Costeira de Pernambuco." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Trechos Monitorados", value: "342", delta: "+12", trend: "up", sub: "segmentos costeiros · PE", icon: MapPin },
  { label: "Índice Médio de Vulnerabilidade", value: "62,4", delta: "+3,1", trend: "up", sub: "IIVC · escala 0–100", icon: Activity },
  { label: "Alertas Ativos", value: "27", delta: "−4", trend: "down", sub: "8 críticos · 19 moderados", icon: AlertTriangle },
  { label: "Última Atualização", value: "há 2h", delta: "12:48", trend: "flat", sub: "ciclo MICA · 14/05/2026", icon: Clock },
];

const hotspots = [
  { id: "PE-047", name: "Praia de Boa Viagem · Recife", score: 73, cls: "Alto", trend: "+4,2" },
  { id: "PE-031", name: "Bairro Novo · Olinda", score: 71, cls: "Alto", trend: "+2,8" },
  { id: "PE-058", name: "Suape · Cabo de Sto. Agostinho", score: 69, cls: "Alto", trend: "+1,9" },
  { id: "PE-024", name: "Ilha de Itamaracá · Pilar", score: 64, cls: "Moderado", trend: "+0,8" },
  { id: "PE-066", name: "Sirinhaém · Barra de Sirinhaém", score: 61, cls: "Moderado", trend: "−0,3" },
];

function clsColor(score: number) {
  if (score >= 80) return "var(--vuln-5)";
  if (score >= 65) return "var(--vuln-4)";
  if (score >= 45) return "var(--vuln-3)";
  if (score >= 25) return "var(--vuln-2)";
  return "var(--vuln-1)";
}

function Dashboard() {
  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">// dashboard executivo</div>
            <h1 className="text-2xl font-semibold mt-1">Visão Geral · Litoral de Pernambuco</h1>
            <p className="text-sm text-muted-foreground mt-1">Síntese operacional do monitoramento costeiro consolidado pelo motor MICA.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 rounded-md panel-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">14 mai 2026 · ciclo 0428</button>
            <button className="h-9 px-3 rounded-md bg-teal text-[color:var(--primary-foreground)] text-xs font-semibold">Exportar Resumo</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            const up = k.trend === "up";
            const down = k.trend === "down";
            return (
              <div key={k.label} className="panel p-5 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-teal/5 blur-2xl" />
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">{k.label}</div>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="text-3xl font-semibold tracking-tight">{k.value}</div>
                  {k.trend !== "flat" && (
                    <span className={`text-xs font-mono flex items-center gap-0.5 ${up ? "text-[color:var(--warn)]" : "text-[color:var(--ok)]"}`}>
                      {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {k.delta}
                    </span>
                  )}
                  {k.trend === "flat" && <span className="text-xs font-mono text-muted-foreground">{k.delta}</span>}
                </div>
                <div className="mt-1 text-[12px] text-foreground/60">{k.sub}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="panel p-5 xl:col-span-2 relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// mapa de vulnerabilidade · IIVC</div>
                <h2 className="text-base font-semibold mt-1">Litoral de Pernambuco · Classes de Vulnerabilidade</h2>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-4 h-[480px]">
              <div className="relative rounded-md panel-2 scanline overflow-hidden h-full">
                <CoastMap active="PE-047" />
                
                {/* Fade-out bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[48px] bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
                
                {/* Floating Button Complete Map */}
                <Link to="/mapa" className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border px-3 py-1.5 rounded-md text-xs font-semibold text-foreground hover:bg-teal hover:text-[color:var(--primary-foreground)] hover:border-teal transition-colors shadow-lg">
                  <Expand className="size-3.5" />
                  Ver mapa completo
                </Link>

                {/* Vulnerability Legend moved to map bottom left */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-[10px] font-mono bg-background/80 backdrop-blur-md border border-border rounded-md px-[10px] py-[6px] shadow-lg">
                  {vulnLegend.map((v) => (
                    <div key={v.cls} className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-sm" style={{ background: `var(--vuln-${v.cls})` }} />
                      <span className="text-foreground/80 uppercase tracking-wider">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[140px] flex flex-col gap-2 text-[10px] font-mono">
                <div className="panel-2 p-2.5">
                  <div className="text-muted-foreground uppercase tracking-wider">cobertura</div>
                  <div className="text-base font-semibold mt-0.5">187 km</div>
                  <div className="text-muted-foreground">linha analisada</div>
                </div>
                <div className="panel-2 p-2.5">
                  <div className="text-muted-foreground uppercase tracking-wider">resolução</div>
                  <div className="text-base font-semibold mt-0.5">100 m</div>
                  <div className="text-muted-foreground">segmentação</div>
                </div>
                <div className="panel-2 p-2.5">
                  <div className="text-muted-foreground uppercase tracking-wider">basemap</div>
                  <div className="text-sm font-semibold mt-0.5">CBERS-4A</div>
                  <div className="text-muted-foreground">ortof. 2025</div>
                </div>
                <div className="panel-2 p-2.5">
                  <div className="text-muted-foreground uppercase tracking-wider">consistência</div>
                  <div className="text-sm font-semibold mt-0.5 text-[color:var(--ok)]">RC 0,07</div>
                  <div className="text-muted-foreground">aprovado</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// hotspots prioritários</div>
                <h2 className="text-base font-semibold mt-1">Trechos mais críticos</h2>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">top 5 · IIVC</span>
            </div>
            <ul className="space-y-2">
              {hotspots.map((h, i) => (
                <li key={h.id} className="panel-2 p-3 hover:border-teal/40 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-mono text-muted-foreground w-4">{String(i + 1).padStart(2, "0")}</div>
                    <div className="size-9 rounded-md flex items-center justify-center text-sm font-mono font-semibold"
                         style={{ background: `color-mix(in oklab, ${clsColor(h.score)} 25%, transparent)`, color: clsColor(h.score), border: `1px solid ${clsColor(h.score)}` }}>
                      {h.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-muted-foreground">{h.id}</div>
                      <div className="text-sm font-medium truncate">{h.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: clsColor(h.score) }}>{h.cls}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">Δ {h.trend}</div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-teal" />
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/alertas" className="mt-3 w-full h-9 rounded-md border border-border text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-teal/40 flex items-center justify-center transition-colors">
              Ver todos os 27 alertas
            </Link>
          </div>
        </div>

        <footer className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border pt-4">
          <div>MICA — Último processamento: há 2 horas · Versão metodológica: MIIC v2.1</div>
          <div className="flex gap-4">
            <span>build 2026.05.14-1247</span>
            <span>SECMA · Governo de Pernambuco</span>
          </div>
        </footer>
      </div>
    </Shell>
  );
}
