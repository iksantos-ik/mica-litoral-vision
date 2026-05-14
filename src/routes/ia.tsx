import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Sparkles, Send, FileText, BookOpen, Database, User } from "lucide-react";

export const Route = createFileRoute("/ia")({
  head: () => ({ meta: [{ title: "Inteligência IA · PGIIC Pernambuco" }] }),
  component: AIPage,
});

const messages = [
  {
    role: "user",
    text: "Quais municípios do litoral pernambucano apresentam os maiores índices de vulnerabilidade costeira em 2025?",
  },
  {
    role: "ai",
    text:
      "Considerando o ciclo MICA #0428 (14/05/2026), três municípios concentram os maiores índices de vulnerabilidade costeira (IIVC) no litoral de Pernambuco em 2025:\n\n• **Recife** — IIVC médio 71,2 (Classe Alto). Setor crítico PE-047 · Boa Viagem (73), com forte contribuição do recuo da linha de costa (+1,4 m/ano) e densidade de edificações litorâneas.\n• **Olinda** — IIVC médio 68,9 (Classe Alto). Setor PE-031 · Bairro Novo, afetado pela combinação de erosão estrutural e patrimônio histórico exposto.\n• **Cabo de Santo Agostinho** — IIVC médio 64,5 (Classe Moderado-Alto). Setor PE-058 · Suape, com pressão socioeconômica e portuária elevada.\n\nFontes: Relatório Técnico MIIC-2025/PE, item 4.2; CPRM (2024) Carta de Suscetibilidade Costeira.",
  },
  {
    role: "user",
    text: "Qual a tendência de IIVC para Boa Viagem nos últimos 10 anos?",
  },
  {
    role: "ai",
    text:
      "O setor PE-047 · Praia de Boa Viagem registra tendência de elevação contínua do IIVC entre 2015 e 2025: passou de 58 para 73 pontos (+15 pts, ≈ +25,9%). O ritmo de variação acelerou após 2020, com média de +1,8 pt/ano, principalmente impulsionado pelo domínio Climático (peso 27,3%) — frequência de ressacas e elevação do nível médio do mar.",
  },
];

const sources = [
  {
    icon: FileText,
    type: "Relatório Técnico",
    title: "MIIC-2025/PE — Síntese Anual de Vulnerabilidade Costeira",
    org: "SECMA · APAC · UFPE",
    score: 0.94,
  },
  {
    icon: BookOpen,
    type: "Normativa",
    title: "Decreto Estadual nº 49.107/2024 — Política Costeira de PE",
    org: "Governo de Pernambuco",
    score: 0.81,
  },
  {
    icon: Database,
    type: "Conjunto de Dados",
    title: "Linha de Costa Multitemporal CBERS-4A · 2015–2025",
    org: "INPE · LAPIS-UFPE",
    score: 0.77,
  },
];

function AIPage() {
  return (
    <Shell dense>
      <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[60fr_40fr]">
        {/* Chat */}
        <div className="flex flex-col border-r border-border min-h-0">
          <div className="h-14 border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-md bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                <Sparkles className="size-4 text-[color:var(--primary-foreground)]" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">Assistente Territorial</div>
                <div className="text-[10px] font-mono text-muted-foreground">modelo: MICA-LLM v1.4 · contexto: 32k</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 h-8 rounded-md border border-teal/40 bg-teal/10">
              <span className="size-1.5 rounded-full bg-teal" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal">RAG Institucional · 847 documentos indexados</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "ai" && (
                  <div className="size-8 rounded-md bg-[color:var(--surface-2)] border border-border flex items-center justify-center shrink-0">
                    <Sparkles className="size-4 text-teal" />
                  </div>
                )}
                <div className={`max-w-[80%] ${m.role === "user" ? "order-1" : ""}`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    {m.role === "user" ? "Você · Analista" : "MICA-LLM · 14:52"}
                  </div>
                  <div className={`p-4 rounded-lg text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-teal/10 border border-teal/30"
                      : "panel"
                  }`}>
                    {m.text.split("**").map((part, idx) =>
                      idx % 2 === 1 ? <strong key={idx} className="text-teal font-semibold">{part}</strong> : part
                    )}
                  </div>
                  {m.role === "ai" && (
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-muted-foreground">
                      <span>3 fontes citadas</span>
                      <span>·</span>
                      <span>confiança 92%</span>
                      <span>·</span>
                      <button className="hover:text-teal">copiar</button>
                      <button className="hover:text-teal">exportar</button>
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="size-8 rounded-md bg-gradient-to-br from-cyan to-teal text-[color:var(--primary-foreground)] flex items-center justify-center text-xs font-semibold shrink-0">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="panel p-3 flex items-end gap-3">
              <textarea
                rows={2}
                placeholder="Consulte os dados territoriais em linguagem natural…"
                className="flex-1 bg-transparent outline-none resize-none text-sm placeholder:text-muted-foreground"
              />
              <button className="size-10 rounded-md bg-teal text-[color:var(--primary-foreground)] flex items-center justify-center glow-teal">
                <Send className="size-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <div className="flex gap-2">
                {["+ Anexar setor", "+ Filtrar por período", "+ Restringir a normas"].map((s) => (
                  <button key={s} className="px-2 h-6 rounded panel-2 hover:border-teal/40">{s}</button>
                ))}
              </div>
              <span>respostas geradas com base no acervo institucional · v1.4</span>
            </div>
          </div>
        </div>

        {/* Context panel */}
        <aside className="overflow-auto p-6">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">// contexto recuperado</div>
          <h2 className="text-base font-semibold mt-1">Fontes Consultadas</h2>
          <p className="text-xs text-muted-foreground mt-1">Documentos e bases utilizados para fundamentar a última resposta.</p>

          <div className="mt-5 space-y-3">
            {sources.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="panel p-4 hover:border-teal/40 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-md bg-[color:var(--surface-2)] border border-border flex items-center justify-center text-teal shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.type}</span>
                        <span className="text-[10px] font-mono text-teal">{(s.score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-sm font-medium mt-1 leading-snug">{s.title}</div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-1">{s.org}</div>
                      <div className="mt-2 h-1 bg-[color:var(--surface-2)] rounded">
                        <div className="h-full rounded bg-gradient-to-r from-teal to-cyan" style={{ width: `${s.score * 100}%` }} />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                        <span>relevância</span>
                        <span>·</span>
                        <button className="hover:text-teal">abrir trecho ↗</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 panel-2 p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Estatísticas do acervo</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><div className="text-lg font-semibold font-mono">847</div><div className="text-muted-foreground text-[10px]">documentos</div></div>
              <div><div className="text-lg font-semibold font-mono">12,4k</div><div className="text-muted-foreground text-[10px]">trechos vetorizados</div></div>
              <div><div className="text-lg font-semibold font-mono">38</div><div className="text-muted-foreground text-[10px]">fontes institucionais</div></div>
              <div><div className="text-lg font-semibold font-mono">2015→</div><div className="text-muted-foreground text-[10px]">cobertura temporal</div></div>
            </div>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
