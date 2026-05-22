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
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Que tipo de diagrama vai criar?
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Escolha um tipo abaixo — o diagrama é criado na hora.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DIAGRAM_TYPE_LIST.map((t) => {
          const Icon = t.icon;
          const isCreating = creatingId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleCreate(t.id)}
              disabled={creatingId !== null}
              className={`relative flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${
                creatingId && !isCreating ? "opacity-50" : ""
              } ${creatingId ? "cursor-default" : "cursor-pointer"}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.iconWrap}`}
              >
                <Icon size={22} stroke={1.8} />
              </div>
              <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">
                {t.label}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.description}
              </p>
              <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Conexões:
                </span>{" "}
                {t.connectionRule}
              </p>

              {isCreating && (
                <span className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-white/80 text-sm font-medium text-indigo-700 dark:bg-slate-900/80 dark:text-indigo-300">
                  <IconLoader2 size={16} className="animate-spin" />
                  Criando...
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
        <ButtonLink href="/dashboard" variant="secondary">
          <IconArrowLeft size={16} stroke={2} />
          Voltar
        </ButtonLink>
      </div>
    </div>
  );
}
