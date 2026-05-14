import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  Cpu,
  Sparkles,
  FileText,
  Settings,
  Waves,
  Bell,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mapa", label: "Mapa SIG", icon: Map },
  { to: "/mica", label: "Motor MICA", icon: Cpu },
  { to: "/ia", label: "Inteligência IA", icon: Sparkles },
  { to: "/relatorio", label: "Relatórios", icon: FileText },
  { to: "/admin", label: "Administração", icon: Settings },
];

export function Shell({ children, dense = false }: { children: ReactNode; dense?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex w-full text-foreground">
      <aside className="w-[72px] xl:w-[230px] shrink-0 border-r border-border bg-[color:var(--surface)]/60 backdrop-blur flex flex-col">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-border">
          <div className="size-9 rounded-md bg-gradient-to-br from-teal to-cyan flex items-center justify-center glow-teal">
            <Waves className="size-5 text-[color:var(--primary-foreground)]" />
          </div>
          <div className="hidden xl:block leading-tight">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Plataforma</div>
            <div className="text-sm font-semibold">PGIIC · PE</div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {nav.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-[color:var(--surface-2)] text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-[color:var(--surface-2)]/60"
                }`}
              >
                <Icon className={`size-[18px] shrink-0 ${active ? "text-teal" : ""}`} />
                <span className="hidden xl:inline">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border hidden xl:block">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Operador</div>
          <div className="text-xs font-medium">SECMA · PE</div>
          <div className="text-[10px] text-muted-foreground font-mono">sessão · 04:21:18</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-[color:var(--surface)]/40 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold tracking-tight">
              Plataforma Geoespacial Integrada de Inteligência Costeira
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">/ PERNAMBUCO</span>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-md bg-[color:var(--surface-2)] border border-border w-[420px]">
              <Search className="size-4 text-muted-foreground" />
              <input
                placeholder="Buscar setor, município, indicador…"
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-muted-foreground"
              />
              <span className="text-[10px] font-mono text-muted-foreground">⌘K</span>
            </div>
          </div>
          <StatusBadge />
          <button className="size-9 rounded-md border border-border bg-[color:var(--surface-2)] flex items-center justify-center relative">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[color:var(--warn)]" />
          </button>
          <div className="size-9 rounded-md bg-gradient-to-br from-cyan to-teal text-[color:var(--primary-foreground)] flex items-center justify-center text-xs font-semibold">
            RP
          </div>
        </header>
        <main className={dense ? "flex-1 min-h-0" : "flex-1 min-h-0 p-6 overflow-auto"}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function StatusBadge() {
  return (
    <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-[color:var(--ok)]/40 bg-[color:var(--ok)]/10">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--ok)] opacity-60 animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-[color:var(--ok)]" />
      </span>
      <span className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--ok)]">
        MICA Engine · Ativo
      </span>
    </div>
  );
}
