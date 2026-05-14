import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { CoastMap, vulnLegend } from "@/components/CoastMap";
import {
  Layers, ZoomIn, ZoomOut, Ruler, Pencil, Download, Play, X, Eye, EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/mapa")({
  head: () => ({ meta: [{ title: "Mapa SIG · PGIIC Pernambuco" }] }),
  component: MapPage,
});

const layers = [
  { name: "Linha de Costa", on: true, color: "var(--cyan)" },
  { name: "IIVC · Vulnerabilidade", on: true, color: "var(--vuln-4)" },
  { name: "Erosão / Acreção", on: true, color: "var(--warn)" },
  { name: "Infraestrutura Exposta", on: false, color: "var(--teal)" },
  { name: "Sensibilidade Ambiental", on: true, color: "var(--ok)" },
  { name: "Ocupação Territorial", on: false, color: "var(--cyan)" },
];

function MapPage() {
  return (
    <Shell dense>
      <div className="relative h-[calc(100vh-4rem)] w-full bg-[color:var(--background)] overflow-hidden">
        {/* Map canvas */}
        <div className="absolute inset-0 scanline">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full aspect-[1/1.6]">
              <CoastMap active="PE-047" />
            </div>
          </div>
        </div>

        {/* Top toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 panel px-2 h-11 flex items-center gap-1">
          {[ZoomIn, ZoomOut, Ruler, Pencil, Download].map((I, idx) => (
            <button key={idx} className="size-9 rounded-md hover:bg-[color:var(--surface-2)] flex items-center justify-center text-muted-foreground hover:text-foreground">
              <I className="size-4" />
            </button>
          ))}
          <div className="h-5 w-px bg-border mx-1" />
          <div className="flex items-center gap-2 px-3 h-9">
            <Play className="size-3.5 text-teal" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">temporal</span>
            <span className="text-xs font-mono text-foreground">2015</span>
            <div className="relative w-56 h-1.5 rounded-full bg-[color:var(--surface-2)]">
              <div className="absolute inset-y-0 left-0 bg-teal rounded-full" style={{ width: "90%" }} />
              <div className="absolute -top-1 size-3.5 rounded-full bg-teal border-2 border-background glow-teal" style={{ left: "calc(90% - 7px)" }} />
              {[0, 25, 50, 75, 100].map((p) => (
                <div key={p} className="absolute -top-0.5 w-px h-2.5 bg-border" style={{ left: `${p}%` }} />
              ))}
            </div>
            <span className="text-xs font-mono text-foreground">2025</span>
          </div>
        </div>

        {/* Left panel */}
        <div className="absolute top-4 left-4 w-72 panel p-4 max-h-[calc(100%-2rem)] overflow-auto">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="size-4 text-teal" />
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// gerenciador de camadas</div>
          </div>
          <div className="space-y-2">
            {layers.map((l) => (
              <div key={l.name} className="panel-2 p-2.5 flex items-center gap-3">
                <button className={`size-8 rounded-md flex items-center justify-center ${l.on ? "bg-teal/15 text-teal border border-teal/40" : "border border-border text-muted-foreground"}`}>
                  {l.on ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 flex-1 rounded-full bg-[color:var(--surface)]">
                      <div className="h-full rounded-full" style={{ width: l.on ? "70%" : "0%", background: l.color }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{l.on ? "70%" : "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Basemap</div>
            <div className="grid grid-cols-3 gap-1.5">
              {["Escuro", "Satélite", "Topo"].map((b, i) => (
                <button key={b} className={`h-8 rounded text-[10px] font-mono uppercase tracking-wider ${i === 0 ? "bg-teal text-[color:var(--primary-foreground)]" : "panel-2 text-muted-foreground"}`}>{b}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - segment details */}
        <div className="absolute top-4 right-4 w-80 panel p-4 max-h-[calc(100%-2rem)] overflow-auto">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal">setor selecionado</div>
              <div className="text-sm font-semibold mt-0.5">PE-047 · Praia de Boa Viagem</div>
              <div className="text-xs text-muted-foreground">Recife · zona urbana costeira</div>
            </div>
            <button className="size-7 rounded panel-2 flex items-center justify-center"><X className="size-3.5" /></button>
          </div>
          <div className="panel-2 p-4 flex items-center gap-4">
            <div className="size-16 rounded-full flex items-center justify-center text-xl font-semibold font-mono"
                 style={{ background: "color-mix(in oklab, var(--vuln-4) 20%, transparent)", color: "var(--vuln-4)", border: "2px solid var(--vuln-4)" }}>
              73
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Pontuação IIVC</div>
              <div className="text-sm font-semibold" style={{ color: "var(--vuln-4)" }}>Classe Alto</div>
              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">↑ +4,2 desde 2020</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Variáveis dominantes</div>
            <div className="space-y-2">
              {[
                { k: "Recuo da linha de costa", v: 0.92 },
                { k: "Densidade de edificações", v: 0.81 },
                { k: "Cota altimétrica média", v: 0.74 },
                { k: "Frequência de ressacas", v: 0.66 },
              ].map((r) => (
                <div key={r.k}>
                  <div className="flex justify-between text-xs"><span>{r.k}</span><span className="font-mono text-muted-foreground">{r.v.toFixed(2)}</span></div>
                  <div className="h-1 bg-[color:var(--surface-2)] rounded mt-1">
                    <div className="h-full rounded" style={{ width: `${r.v * 100}%`, background: "var(--teal)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full h-9 rounded-md bg-teal text-[color:var(--primary-foreground)] text-xs font-semibold">Abrir ficha completa</button>
        </div>

        {/* Floating legend */}
        <div className="absolute bottom-4 left-4 panel px-4 py-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">IIVC · vulnerabilidade costeira</div>
          <div className="flex items-center gap-3">
            {vulnLegend.map((v) => (
              <div key={v.cls} className="flex items-center gap-2">
                <span className="w-6 h-2 rounded-sm" style={{ background: `var(--vuln-${v.cls})` }} />
                <span className="text-[10px] font-mono">{v.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[10px] font-mono text-muted-foreground">escala 0–100 · método AHP/MICA</div>
        </div>

        {/* Coordinates */}
        <div className="absolute bottom-4 right-4 panel px-3 py-2 text-[10px] font-mono text-muted-foreground">
          lat −8.1213 · lon −34.8956 · zoom 12 · EPSG:4674
        </div>
      </div>
    </Shell>
  );
}
