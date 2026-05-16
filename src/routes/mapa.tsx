import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { CoastMap, vulnLegend, sectors } from "@/components/CoastMap";
import {
  Layers, ZoomIn, ZoomOut, Ruler, Pencil, Download, Play, X, Eye, EyeOff, MapPin, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/mapa")({
  head: () => ({ meta: [{ title: "Mapa SIG · PGIIC Pernambuco" }] }),
  component: MapPage,
});

const initialLayers = [
  { name: "Linha de Costa", on: true, color: "var(--cyan)" },
  { name: "IIVC · Vulnerabilidade", on: true, color: "var(--vuln-4)" },
  { name: "Erosão / Acreção", on: true, color: "var(--warn)" },
  { name: "Infraestrutura Exposta", on: false, color: "var(--teal)" },
  { name: "Sensibilidade Ambiental", on: true, color: "var(--ok)" },
  { name: "Ocupação Territorial", on: false, color: "var(--cyan)" },
];

const classColor: Record<string, string> = {
  "Muito Baixo": "var(--vuln-1)",
  "Baixo": "var(--vuln-2)",
  "Moderado": "var(--vuln-3)",
  "Alto": "var(--vuln-4)",
  "Muito Alto": "var(--vuln-5)",
};

function MapPage() {
  const [selectedId, setSelectedId] = useState("PE-047");
  const [openSector, setOpenSector] = useState(false);
  const [layers, setLayers] = useState(initialLayers);
  const [fadeKey, setFadeKey] = useState(0);

  const sector = sectors.find((s) => s.id === selectedId)!;
  const color = classColor[sector.className];
  const iivcLayerOn = layers.find((l) => l.name === "IIVC · Vulnerabilidade")?.on;

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setFadeKey((k) => k + 1);
  };

  const toggleLayer = (name: string) => {
    setLayers((ls) => ls.map((l) => (l.name === name ? { ...l, on: !l.on } : l)));
  };

  return (
    <Shell dense>
      <div className="relative h-[calc(100vh-4rem)] w-full bg-[color:var(--background)] overflow-hidden">
        {/* Map canvas */}
        <div className="absolute inset-0 scanline">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full aspect-[1/1.6]">
              <CoastMap active={selectedId} onSelect={handleSelect} hidden={!iivcLayerOn} />
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
              <div key={l.name} className="panel-2 p-2.5 flex items-center gap-3" style={{ transition: "opacity 150ms" }}>
                <button
                  onClick={() => toggleLayer(l.name)}
                  className={`size-8 rounded-md flex items-center justify-center transition-all duration-150 ${
                    l.on
                      ? "bg-teal/15 text-teal border border-teal/40"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.on ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate transition-colors duration-150 ${l.on ? "" : "text-muted-foreground"}`}>{l.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 flex-1 rounded-full bg-[color:var(--surface)]">
                      <div
                        className="h-full rounded-full transition-all duration-150"
                        style={{
                          width: l.on ? "70%" : "0%",
                          background: l.on ? l.color : "var(--muted-foreground)",
                          opacity: l.on ? 1 : 0.3,
                        }}
                      />
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
        <div key={fadeKey} className="absolute top-4 right-4 w-80 panel p-4 max-h-[calc(100%-2rem)] overflow-auto animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal">setor selecionado</div>
              <div className="text-sm font-semibold mt-0.5">{sector.id} · {sector.name}</div>
              <div className="text-xs text-muted-foreground">{sector.municipality} · {sector.zone}</div>
            </div>
            <button className="size-7 rounded panel-2 flex items-center justify-center"><X className="size-3.5" /></button>
          </div>
          <div className="panel-2 p-4 flex items-center gap-4">
            <div className="size-16 rounded-full flex items-center justify-center text-xl font-semibold font-mono"
                 style={{ background: `color-mix(in oklab, ${color} 20%, transparent)`, color, border: `2px solid ${color}` }}>
              {sector.iivc}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Pontuação IIVC</div>
              <div className="text-sm font-semibold" style={{ color }}>Classe {sector.className}</div>
              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">↑ +{sector.delta.toFixed(1).replace(".", ",")} desde 2020</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Variáveis dominantes</div>
            <div className="space-y-2">
              {sector.variables.map((r) => (
                <div key={r.k}>
                  <div className="flex justify-between text-xs"><span>{r.k}</span><span className="font-mono text-muted-foreground">{r.v.toFixed(2)}</span></div>
                  <div className="h-1 bg-[color:var(--surface-2)] rounded mt-1">
                    <div className="h-full rounded transition-all duration-300" style={{ width: `${r.v * 100}%`, background: "var(--teal)" }} />
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
