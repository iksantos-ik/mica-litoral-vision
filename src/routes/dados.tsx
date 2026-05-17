import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Waves,
  Leaf,
  CloudRain,
  Users,
  Mountain,
  Building2,
  ChevronDown,
  ChevronRight,
  UploadCloud,
  Download,
  FileSpreadsheet,
  Save,
  PlayCircle,
  X,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/dados")({
  head: () => ({
    meta: [
      { title: "Gestão de Dados de Entrada — Motor MICA · PGIIC Pernambuco" },
      {
        name: "description",
        content:
          "Painel de gestão de fontes automáticas e medições de campo que alimentam o Motor Integrado Costeiro Analítico (MICA).",
      },
    ],
  }),
  component: DadosPage,
});

type Status = "ok" | "wait" | "err";

const domainIcon: Record<string, typeof Waves> = {
  Climático: CloudRain,
  Ambiental: Leaf,
  Socioeconômico: Users,
  Físico: Mountain,
  Territorial: Building2,
};

const domainColor: Record<string, string> = {
  Climático: "var(--cyan)",
  Ambiental: "var(--ok)",
  Socioeconômico: "var(--warn)",
  Físico: "var(--teal)",
  Territorial: "var(--vuln-3)",
};

type Source = {
  domain: keyof typeof domainIcon;
  indicator: string;
  source: string;
  url: string;
  status: Status;
  last: string;
};

const sources: Source[] = [
  { domain: "Climático", indicator: "Altura de ondas e ventos", source: "INMET — Inst. Nacional de Meteorologia", url: "api.inmet.gov.br/condicao", status: "ok", last: "15/05/2026 · 06:12" },
  { domain: "Climático", indicator: "Nível do mar e marés", source: "PNBOIA / DHN — Marinha do Brasil", url: "goosbrasil.org/pnboia", status: "ok", last: "15/05/2026 · 05:48" },
  { domain: "Ambiental", indicator: "Áreas de proteção ambiental", source: "IBGE — Malha de Unidades de Conservação", url: "geoftp.ibge.gov.br/uc", status: "ok", last: "14/05/2026 · 22:00" },
  { domain: "Socioeconômico", indicator: "Densidade populacional", source: "IBGE — Censo 2022", url: "censo2022.ibge.gov.br/api", status: "wait", last: "13/05/2026 · 09:21" },
  { domain: "Socioeconômico", indicator: "Uso e ocupação do solo", source: "MapBiomas — Coleção 9", url: "mapbiomas.org/collections/9", status: "ok", last: "14/05/2026 · 18:42" },
  { domain: "Territorial", indicator: "Infraestrutura exposta", source: "OpenStreetMap + Base Estadual PE", url: "overpass-api.de + cprh.pe", status: "ok", last: "15/05/2026 · 04:30" },
  { domain: "Ambiental", indicator: "Cobertura de manguezal", source: "MapBiomas Água — série temporal", url: "mapbiomas.org/agua", status: "wait", last: "12/05/2026 · 15:10" },
  { domain: "Climático", indicator: "Projeções de elevação do nível do mar", source: "INPE — Painel Brasileiro de Mudanças Climáticas", url: "pbmc.coppe.ufrj.br/api", status: "err", last: "08/05/2026 · 11:02" },
];

const okCount = sources.filter((s) => s.status === "ok").length;
const totalReady = 11;
const totalSources = 14;

function StatusBadge({ s }: { s: Status }) {
  const map = {
    ok: { label: "Sincronizado", color: "var(--ok)", Icon: CheckCircle2 },
    wait: { label: "Aguardando", color: "var(--warn)", Icon: Clock },
    err: { label: "Erro de Conexão", color: "var(--danger)", Icon: AlertTriangle },
  } as const;
  const { label, color, Icon } = map[s];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 h-6 rounded text-[10px] font-mono uppercase tracking-wider border"
      style={{ borderColor: `color-mix(in oklab, ${color} 40%, transparent)`, background: `color-mix(in oklab, ${color} 10%, transparent)`, color }}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}

function SourceRow({ src }: { src: Source }) {
  const Icon = domainIcon[src.domain];
  const color = domainColor[src.domain];
  const [loading, setLoading] = useState(false);
  return (
    <tr className="border-b border-border/60 hover:bg-[color:var(--surface-2)]/40">
      <td className="py-3 pl-4">
        <div className="flex items-center gap-2.5">
          <span className="size-8 rounded-md flex items-center justify-center border border-border" style={{ background: `color-mix(in oklab, ${color} 12%, transparent)` }}>
            <Icon className="size-4" style={{ color }} />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{src.domain}</span>
        </div>
      </td>
      <td className="py-3">
        <div className="text-sm font-medium">{src.indicator}</div>
        <div className="text-xs text-muted-foreground">{src.source}</div>
      </td>
      <td className="py-3 font-mono text-[11px] text-muted-foreground">{src.url}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <StatusBadge s={src.status} />
          {src.status === "err" && (
            <span className="group relative">
              <AlertTriangle className="size-3.5 text-[color:var(--danger)]" />
              <span className="absolute left-1/2 -translate-x-1/2 top-5 z-10 hidden group-hover:block whitespace-nowrap text-[10px] font-mono px-2 py-1 rounded border border-[color:var(--danger)]/40 bg-[color:var(--surface-2)] text-[color:var(--danger)]">
                Falha na autenticação — verifique as credenciais da API
              </span>
            </span>
          )}
        </div>
      </td>
      <td className="py-3 font-mono text-[11px] text-muted-foreground">{src.last}</td>
      <td className="py-3 pr-4 text-right">
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1400);
          }}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded border border-border bg-[color:var(--surface-2)] text-[11px] font-mono uppercase tracking-wider hover:border-teal hover:text-teal transition-colors"
        >
          <RefreshCw className={`size-3 ${loading ? "animate-spin text-teal" : ""}`} />
          {loading ? "Sincronizando…" : "Sincronizar"}
        </button>
      </td>
    </tr>
  );
}

type DomainCard = {
  name: keyof typeof domainIcon;
  filled: number;
  total: number;
};

const fieldDomains: DomainCard[] = [
  { name: "Físico", filled: 3, total: 6 },
  { name: "Ambiental", filled: 0, total: 4 },
  { name: "Climático", filled: 2, total: 3 },
  { name: "Socioeconômico", filled: 0, total: 5 },
];

function CollapsibleHeader({
  d,
  open,
  onToggle,
}: {
  d: DomainCard;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = domainIcon[d.name];
  const color = domainColor[d.name];
  const pct = (d.filled / d.total) * 100;
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left">
      {open ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
      <span className="size-9 rounded-md flex items-center justify-center border border-border" style={{ background: `color-mix(in oklab, ${color} 12%, transparent)` }}>
        <Icon className="size-4" style={{ color }} />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold">Domínio {d.name}</div>
        <div className="text-[11px] font-mono text-muted-foreground">{d.filled} de {d.total} indicadores preenchidos</div>
      </div>
      <div className="w-32 h-1.5 rounded bg-[color:var(--surface-2)] overflow-hidden">
        <div className="h-full rounded" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, var(--cyan))` }} />
      </div>
    </button>
  );
}

function FieldFormCard() {
  const [openDomain, setOpenDomain] = useState<string>("Físico");
  return (
    <div className="space-y-3">
      {fieldDomains.map((d) => {
        const open = openDomain === d.name;
        return (
          <div key={d.name} className="panel">
            <CollapsibleHeader d={d} open={open} onToggle={() => setOpenDomain(open ? "" : d.name)} />
            {open && d.name === "Físico" && (
              <div className="px-4 pb-5 pt-1 border-t border-border/60 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Setor costeiro</label>
                    <select className="mt-1.5 w-full h-10 px-3 rounded-md border border-border bg-[color:var(--surface-2)] text-sm">
                      <option>PE-001 · Goiana / Pontas de Pedra</option>
                      <option>PE-014 · Olinda / Carmo</option>
                      <option>PE-027 · Recife / Boa Viagem</option>
                      <option>PE-042 · Cabo / Suape Norte</option>
                      <option>PE-089 · São José da Coroa Grande</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Taxa de erosão / acreção (m/ano)</label>
                    <input type="number" defaultValue={-1.8} step={0.1} className="mt-1.5 w-full h-10 px-3 rounded-md border border-border bg-[color:var(--surface-2)] text-sm font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Largura média da faixa de praia (m)</label>
                    <input type="number" defaultValue={42} className="mt-1.5 w-full h-10 px-3 rounded-md border border-border bg-[color:var(--surface-2)] text-sm font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Tipo de substrato predominante</label>
                    <select className="mt-1.5 w-full h-10 px-3 rounded-md border border-border bg-[color:var(--surface-2)] text-sm">
                      <option>Arenoso fino</option>
                      <option>Arenoso médio</option>
                      <option>Cascalho</option>
                      <option>Rochoso</option>
                      <option>Misto</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Estruturas de contenção</label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <button className="h-9 px-4 rounded-md bg-teal text-[color:var(--primary-foreground)] text-xs font-semibold">Sim</button>
                        <button className="h-9 px-4 rounded-md border border-border bg-[color:var(--surface-2)] text-xs">Não</button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Observação</label>
                      <input placeholder="Ex.: enrocamento em 320 m da extensão norte…" className="mt-1.5 w-full h-9 px-3 rounded-md border border-border bg-[color:var(--surface-2)] text-sm" />
                    </div>
                  </div>
                </div>

                <div className="border border-dashed border-border rounded-md p-5 flex items-center gap-3 bg-[color:var(--surface-2)]/40">
                  <div className="size-10 rounded-md bg-[color:var(--surface-2)] border border-border flex items-center justify-center">
                    <Camera className="size-5 text-teal" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Anexar registro fotográfico ou laudo técnico</div>
                    <div className="text-[11px] text-muted-foreground">Arraste arquivos aqui ou clique para selecionar · JPG, PNG, PDF (até 25MB)</div>
                  </div>
                  <button className="h-9 px-3 rounded-md border border-border bg-[color:var(--surface-2)] text-xs font-mono uppercase tracking-wider">Selecionar</button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <div className="text-[11px] font-mono text-muted-foreground">3 de 6 indicadores preenchidos</div>
                  <div className="w-40 h-1.5 rounded bg-[color:var(--surface-2)] overflow-hidden">
                    <div className="h-full rounded bg-gradient-to-r from-teal to-cyan" style={{ width: "50%" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const uploads = [
  { date: "12/05/2026 · 14:08", file: "medicoes_pe_2025_s1_v3.xlsx", rows: 286, status: "ok", user: "M. Albuquerque" },
  { date: "08/05/2026 · 09:42", file: "medicoes_pe_2025_s1_v2.xlsx", rows: 274, status: "warn", user: "R. Pessoa" },
  { date: "02/05/2026 · 17:22", file: "medicoes_pe_2025_s1_v1.csv", rows: 261, status: "err", user: "R. Pessoa" },
];

function UploadTab() {
  return (
    <div className="space-y-5">
      <div className="panel p-8 border-2 border-dashed flex flex-col items-center text-center gap-3 bg-[color:var(--surface-2)]/30">
        <div className="size-14 rounded-full bg-teal/10 border border-teal/40 flex items-center justify-center glow-teal">
          <UploadCloud className="size-7 text-teal" />
        </div>
        <div>
          <div className="text-base font-semibold">Arraste a planilha de medições aqui ou clique para selecionar</div>
          <div className="text-xs text-muted-foreground mt-1">Formatos aceitos: <span className="font-mono">.xlsx</span>, <span className="font-mono">.csv</span> · tamanho máximo 50MB</div>
        </div>
        <button className="mt-2 h-10 px-5 rounded-md bg-teal text-[color:var(--primary-foreground)] text-sm font-semibold inline-flex items-center gap-2 glow-teal">
          <Download className="size-4" /> Baixar Template Padrão MICA (.xlsx)
        </button>
      </div>

      <div className="panel p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// histórico</div>
            <h3 className="text-sm font-semibold mt-1">Últimos uploads de planilha</h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">3 registros</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left py-2 font-normal">Data</th>
              <th className="text-left py-2 font-normal">Arquivo</th>
              <th className="text-left py-2 font-normal">Registros</th>
              <th className="text-left py-2 font-normal">Validação</th>
              <th className="text-left py-2 font-normal">Responsável</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((u, i) => (
              <tr key={i} className="border-b border-border/60">
                <td className="py-3 font-mono text-[11px] text-muted-foreground">{u.date}</td>
                <td className="py-3 font-mono text-teal flex items-center gap-2"><FileSpreadsheet className="size-3.5" />{u.file}</td>
                <td className="py-3 font-mono">{u.rows}</td>
                <td className="py-3">
                  <StatusBadge s={u.status as Status} />
                </td>
                <td className="py-3 text-xs">{u.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-md border border-[color:var(--warn)]/40 bg-[color:var(--warn)]/5">
        <AlertTriangle className="size-4 text-[color:var(--warn)] shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          O template deve ser preenchido <span className="text-foreground font-medium">exatamente</span> conforme o modelo. Campos obrigatórios marcados com <span className="text-[color:var(--warn)] font-mono">*</span> não podem estar vazios.
        </div>
      </div>
    </div>
  );
}

function ValidateModal({ onClose }: { onClose: () => void }) {
  const items = [
    { ok: true, label: "8 fontes automáticas sincronizadas (Climático, Ambiental, Territorial)" },
    { ok: true, label: "Domínio Físico — 3 de 6 indicadores preenchidos" },
    { ok: true, label: "Razão de Consistência da matriz AHP: 0,07 (aprovado)" },
    { ok: false, label: "INPE — Projeções de elevação: erro de autenticação" },
    { ok: false, label: "Domínio Ambiental e Socioeconômico sem medições de campo" },
    { ok: false, label: "Densidade populacional IBGE — sincronização pendente" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl panel p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-teal">// validação pré-processamento</div>
            <h3 className="text-lg font-semibold mt-1">Confirmar entrada de dados para o Motor MICA</h3>
            <p className="text-xs text-muted-foreground mt-1">Revise os itens prontos e pendentes antes de iniciar o cálculo dos indicadores costeiros.</p>
          </div>
          <button onClick={onClose} className="size-8 rounded-md border border-border bg-[color:var(--surface-2)] flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-auto pr-1">
          {items.map((it, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-md border border-border bg-[color:var(--surface-2)]/40">
              {it.ok ? (
                <CheckCircle2 className="size-4 text-[color:var(--ok)] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="size-4 text-[color:var(--warn)] shrink-0 mt-0.5" />
              )}
              <div className="text-sm">{it.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-muted-foreground">3 itens prontos · 3 pendentes</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="h-10 px-4 rounded-md border border-border bg-[color:var(--surface-2)] text-sm">Voltar e completar</button>
            <button className="h-10 px-5 rounded-md bg-teal text-[color:var(--primary-foreground)] text-sm font-semibold inline-flex items-center gap-2 glow-teal">
              <PlayCircle className="size-4" /> Processar mesmo assim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DadosPage() {
  const [tab, setTab] = useState<"form" | "upload">("form");
  const [showModal, setShowModal] = useState(false);
  const hasError = sources.some((s) => s.status === "err");
  const readyPct = (totalReady / totalSources) * 100;

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">// gestão de dados de entrada</div>
            <h1 className="text-2xl font-semibold mt-1 flex items-center gap-3">
              <Database className="size-6 text-teal" />
              Gestão de Dados de Entrada — Motor MICA
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Gerencie as fontes automáticas e insira medições de campo para alimentar os cálculos do MICA.
            </p>
          </div>
          <div className="flex items-end gap-4">
            <div className="panel p-3 min-w-[280px]">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span>Prontidão para processamento</span>
                <span className="text-foreground font-semibold">{totalReady}/{totalSources}</span>
              </div>
              <div className="h-2 mt-2 rounded bg-[color:var(--surface-2)] overflow-hidden">
                <div className="h-full rounded bg-gradient-to-r from-teal to-cyan" style={{ width: `${readyPct}%` }} />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mt-1.5">{totalReady} de {totalSources} fontes atualizadas</div>
            </div>
            <button
              disabled={hasError}
              className="h-11 px-5 rounded-md text-sm font-semibold flex items-center gap-2 bg-teal text-[color:var(--primary-foreground)] glow-teal disabled:opacity-40 disabled:cursor-not-allowed disabled:glow-teal/0"
              title={hasError ? "Corrija as fontes com erro antes de iniciar o processamento" : ""}
            >
              <PlayCircle className="size-4" /> Iniciar Processamento MICA
            </button>
          </div>
        </div>

        {/* BLOCO 1 */}
        <section className="panel">
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// bloco 1</div>
              <h2 className="text-base font-semibold mt-1">Fontes Automáticas — Integração com Plataformas Externas</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Dados capturados automaticamente via API de plataformas de dados abertos.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 text-[color:var(--ok)]"><span className="size-1.5 rounded-full bg-[color:var(--ok)]" />{okCount} sincronizadas</span>
              <span className="inline-flex items-center gap-1.5 text-[color:var(--warn)]"><span className="size-1.5 rounded-full bg-[color:var(--warn)]" />{sources.filter(s => s.status === "wait").length} aguardando</span>
              <span className="inline-flex items-center gap-1.5 text-[color:var(--danger)]"><span className="size-1.5 rounded-full bg-[color:var(--danger)]" />{sources.filter(s => s.status === "err").length} erro</span>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-[color:var(--surface-2)]/40">
                <tr>
                  <th className="text-left py-2.5 pl-4 font-normal">Domínio</th>
                  <th className="text-left py-2.5 font-normal">Indicador / Fonte</th>
                  <th className="text-left py-2.5 font-normal">Origem</th>
                  <th className="text-left py-2.5 font-normal">Status</th>
                  <th className="text-left py-2.5 font-normal">Última sincronização</th>
                  <th className="text-right py-2.5 pr-4 font-normal">Ação</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <SourceRow key={s.indicator} src={s} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* BLOCO 2 */}
        <section className="panel">
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// bloco 2</div>
              <h2 className="text-base font-semibold mt-1">Medições de Campo — Inserção Semestral</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Dados obtidos por campanhas presenciais. Ciclo atual: <span className="text-foreground font-medium">1º Semestre 2025</span>.</p>
            </div>
            <div className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-teal/40 bg-teal/10 text-[11px] font-mono text-teal">
              <Clock className="size-3.5" />
              Próxima janela: Julho 2025 · Equipe Técnica OLCP
            </div>
          </div>

          <div className="px-5 pt-4">
            <div className="inline-flex p-1 rounded-md border border-border bg-[color:var(--surface-2)]/60">
              <button
                onClick={() => setTab("form")}
                className={`px-4 h-9 rounded text-sm font-medium ${tab === "form" ? "bg-teal text-[color:var(--primary-foreground)]" : "text-muted-foreground hover:text-foreground"}`}
              >
                Inserção por Formulário
              </button>
              <button
                onClick={() => setTab("upload")}
                className={`px-4 h-9 rounded text-sm font-medium ${tab === "upload" ? "bg-teal text-[color:var(--primary-foreground)]" : "text-muted-foreground hover:text-foreground"}`}
              >
                Upload de Planilha
              </button>
            </div>
          </div>

          <div className="p-5">
            {tab === "form" ? <FieldFormCard /> : <UploadTab />}
          </div>
        </section>

        {/* BLOCO 3 — Footer */}
        <section className="panel p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="text-xs font-mono text-muted-foreground">
            Status geral: <span className="text-foreground">11/14 fontes prontas</span> · 3 domínios com preenchimento incompleto · Última atualização: hoje às 14h32
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-md border border-border bg-[color:var(--surface-2)] text-sm inline-flex items-center gap-2">
              <Save className="size-4" /> Salvar Rascunho
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="h-10 px-5 rounded-md bg-teal text-[color:var(--primary-foreground)] text-sm font-semibold inline-flex items-center gap-2 glow-teal"
            >
              <CheckCircle2 className="size-4" /> Validar e Preparar para o MICA
            </button>
          </div>
        </section>
      </div>

      {showModal && <ValidateModal onClose={() => setShowModal(false)} />}
    </Shell>
  );
}
