"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import { DIAGRAM_TYPE_LIST } from "@/lib/diagram-types";
import { ButtonLink } from "@/components/ui/Button";

export function TypeWizard() {
  const router = useRouter();
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCreate(typeId: string) {
    if (creatingId) return;
    setCreatingId(typeId);
    setError("");

    try {
      const res = await fetch("/api/diagrams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: typeId }),
      });

      if (!res.ok) {
        setError("Não foi possível criar o diagrama. Tente novamente.");
        setCreatingId(null);
        return;
      }

      const diagram = await res.json();
      router.push(`/diagrams/${diagram.id}`);
    } catch {
      setError("Não foi possível criar o diagrama. Verifique sua conexão e tente novamente.");
      setCreatingId(null);
    }
  }

  return (
    <div className="ambient-mesh">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          Que tipo de diagrama vai criar?
        </h1>
        <p className="mt-2 text-base text-on-surface-variant">
          Escolha um tipo abaixo — o diagrama é criado na hora.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DIAGRAM_TYPE_LIST.map((t) => {
          const Icon = t.icon;
          const isCreating = creatingId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleCreate(t.id)}
              disabled={creatingId !== null}
              className={`group glass inner-glow relative flex flex-col rounded-2xl p-5 text-left transition-all duration-300 ${
                creatingId && !isCreating ? "opacity-40" : ""
              } ${
                creatingId
                  ? "cursor-default"
                  : "cursor-pointer hover:scale-[1.02] hover:border-electric/40"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-electric/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl ${t.iconWrap}`}
              >
                <Icon size={22} stroke={1.8} />
              </div>

              <h3 className="relative z-10 mt-4 text-lg font-bold text-on-surface">
                {t.label}
              </h3>
              <p className="relative z-10 mt-1 text-sm text-on-surface-variant">
                {t.description}
              </p>

              <div className="relative z-10 mt-4 border-t border-outline-variant pt-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-muted">
                  Regra de conexão
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {t.connectionRule}
                </p>
              </div>

              {isCreating && (
                <span className="absolute inset-0 z-20 flex items-center justify-center gap-2 rounded-2xl bg-surface-glass-strong text-sm font-semibold text-electric backdrop-blur">
                  <IconLoader2 size={16} className="animate-spin" />
                  Criando...
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-8 border-t border-outline-variant pt-5">
        <ButtonLink href="/dashboard" variant="secondary">
          <IconArrowLeft size={16} stroke={2} />
          Voltar
        </ButtonLink>
      </div>
    </div>
  );
}
