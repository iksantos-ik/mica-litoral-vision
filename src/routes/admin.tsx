import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administração · PGIIC Pernambuco" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center text-center py-20">
        <Settings className="size-10 text-teal mb-4" />
        <h1 className="text-xl font-semibold">Administração</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Módulo de gestão de usuários, permissões e parâmetros institucionais. Disponível na próxima iteração do protótipo.
        </p>
      </div>
    </Shell>
  );
}
