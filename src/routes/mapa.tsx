import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { CoastMap, vulnLegend, sectors } from "@/components/CoastMap";
import {
  Layers, ZoomIn, ZoomOut, Ruler, Pencil, Download, Play, X, Eye, EyeOff, MapPin, ChevronDown, ChevronLeft, ChevronRight
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
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [filters, setFilters] = useState({ high: true, medium: true, low: true });

  const sector = sectors.find((s) => s.id === selectedId)!;
  const color = classColor[sector.className];
  const iivcLayerOn = layers.find((l) => l.name === "IIVC · Vulnerabilidade")?.on;

  const hiddenClasses = [];
  if (!filters.high) hiddenClasses.push(4, 5);
  if (!filters.medium) hiddenClasses.push(3);
  if (!filters.low) hiddenClasses.push(1, 2);

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
            <div className="w-full h-full">
              <CoastMap active={selectedId} onSelect={handleSelect} hidden={!iivcLayerOn} hiddenClasses={hiddenClasses} />
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
        <div className={`absolute top-4 left-4 panel p-3 max-h-[calc(100%-2rem)] overflow-hidden transition-all duration-200 flex flex-col ${leftPanelOpen ? "w-72" : "w-[40px] items-center"}`}>
          <div className="flex items-center justify-between mb-3 shrink-0">
            {leftPanelOpen && (
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-teal shrink-0" />
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">// gerenciador</div>
              </div>
            )}
            <button onClick={() => setLeftPanelOpen(!leftPanelOpen)} className="size-6 rounded-md hover:bg-[color:var(--surface-2)] flex items-center justify-center text-muted-foreground shrink-0">
              {leftPanelOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto overflow-x-hidden flex-1 min-h-0 pr-1 -mr-1">
            {layers.map((l) => (
              <div key={l.name} className={`panel-2 flex items-center gap-3 transition-opacity duration-150 ${leftPanelOpen ? "py-2 px-2.5" : "p-0.5 border-none bg-transparent"}`}>
                <button
                  onClick={() => toggleLayer(l.name)}
                  className={`size-7 rounded-md shrink-0 flex items-center justify-center transition-all duration-150 ${
                    l.on
                      ? "bg-teal/15 text-teal border border-teal/40"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                  title={!leftPanelOpen ? l.name : undefined}
                >
                  {l.on ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
                {leftPanelOpen && (
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate transition-colors duration-150 ${l.on ? "" : "text-muted-foreground"}`}>{l.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1 flex-1 rounded-full bg-[color:var(--surface)]">
                        <div
                          className="h-full rounded-full transition-all duration-150"
                          style={{ width: l.on ? "70%" : "0%", background: l.on ? l.color : "var(--muted-foreground)", opacity: l.on ? 1 : 0.3 }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{l.on ? "70%" : "—"}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {leftPanelOpen && (
              <>
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Basemap</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["Escuro", "Satélite", "Topo"].map((b, i) => (
                      <button key={b} className={`h-8 rounded text-[10px] font-mono uppercase tracking-wider ${i === 0 ? "bg-teal text-[color:var(--primary-foreground)]" : "panel-2 text-muted-foreground"}`}>{b}</button>
                    ))}
                  </div>
                </div>

                {/* Resumo do litoral */}
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Resumo do litoral</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>Setores monitorados:</span> <span className="font-mono">342</span></div>
                    <div className="flex justify-between text-[color:var(--danger)] font-medium"><span>Em alerta:</span> <span className="font-mono">27</span></div>
                    <div className="flex justify-between"><span>IIVC médio:</span> <span className="font-mono">62,4</span></div>
                  </div>
                  <div className="flex h-1 mt-2 rounded-full overflow-hidden opacity-80">
                    <div className="h-full bg-[color:var(--vuln-1)]" style={{ width: "30%" }} />
                    <div className="h-full bg-[color:var(--vuln-2)]" style={{ width: "25%" }} />
                    <div className="h-full bg-[color:var(--vuln-3)]" style={{ width: "20%" }} />
                    <div className="h-full bg-[color:var(--vuln-4)]" style={{ width: "15%" }} />
                    <div className="h-full bg-[color:var(--vuln-5)]" style={{ width: "10%" }} />
                  </div>
                </div>

                {/* Filtros rápidos */}
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Filtros rápidos</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <input type="checkbox" className="accent-teal cursor-pointer" checked={filters.high} onChange={e => setFilters(f => ({ ...f, high: e.target.checked }))} />
                      <span className="size-2 rounded-full bg-[color:var(--vuln-4)]" />
                      Alto risco
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <input type="checkbox" className="accent-teal cursor-pointer" checked={filters.medium} onChange={e => setFilters(f => ({ ...f, medium: e.target.checked }))} />
                      <span className="size-2 rounded-full bg-[color:var(--vuln-3)]" />
                      Moderado
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <input type="checkbox" className="accent-teal cursor-pointer" checked={filters.low} onChange={e => setFilters(f => ({ ...f, low: e.target.checked }))} />
                      <span className="size-2 rounded-full bg-[color:var(--vuln-1)]" />
                      Baixo / Muito baixo
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right panel - segment details */}
        <div key={fadeKey} className="absolute top-4 right-4 w-80 panel p-4 max-h-[calc(100%-2rem)] overflow-visible animate-fade-in">
          {/* Sector selector */}
          <div className="relative mb-3 z-30">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <MapPin className="size-3 text-teal" /> // selecionar setor
            </div>
            <button
              onClick={() => setOpenSector((o) => !o)}
              className={`w-full h-9 px-2.5 rounded-md panel-2 border flex items-center justify-between text-xs transition-colors ${
                openSector ? "border-cyan text-cyan" : "border-border hover:border-cyan/40"
              }`}
            >
              <span className="font-mono truncate">
                <span className={openSector ? "text-cyan" : "text-teal"}>{sector.id}</span>
                <span className="text-foreground"> · {sector.name}</span>
              </span>
              <ChevronDown className={`size-3.5 shrink-0 ml-2 transition-transform duration-200 ${openSector ? "rotate-180 text-cyan" : "text-muted-foreground"}`} />
            </button>
            {openSector && (
              <div className="absolute z-50 left-0 right-0 mt-1.5 panel p-1 bg-[color:var(--surface)] shadow-2xl max-h-72 overflow-auto animate-fade-in">
                {sectors.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { handleSelect(s.id); setOpenSector(false); }}
                    className={`w-full text-left px-2.5 py-2 rounded text-xs flex items-center gap-2 hover:bg-[color:var(--surface-2)] ${
                      s.id === selectedId ? "bg-cyan/10" : ""
                    }`}
                  >
                    <span className="font-mono text-teal">{s.id}</span>
                    <span className="truncate flex-1">{s.name}</span>
                    <span className="size-2 rounded-sm shrink-0" style={{ background: `var(--vuln-${s.cls})` }} />
                  </button>
                ))}
              </div>
            )}
          </div>

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
