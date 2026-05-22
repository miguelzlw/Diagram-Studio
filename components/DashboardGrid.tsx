"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconPlus, IconFileText, IconTrash } from "@tabler/icons-react";
import { TypeBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getDiagramType } from "@/lib/diagram-types";

export interface DiagramListItem {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DashboardGrid({
  diagrams,
}: {
  diagrams: DiagramListItem[];
}) {
  const [items, setItems] = useState(diagrams);
  const [filter, setFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const presentTypes = useMemo(() => {
    const seen = new Set(items.map((d) => d.type));
    return [...seen];
  }, [items]);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((d) => d.type === filter)),
    [items, filter],
  );

  async function handleDelete(e: React.MouseEvent, item: DiagramListItem) {
    e.preventDefault();
    e.stopPropagation();
    if (
      !window.confirm(
        `Excluir o diagrama "${item.name}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }
    setDeletingId(item.id);
    const res = await fetch(`/api/diagrams/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((d) => d.id !== item.id));
    } else {
      window.alert("Não foi possível excluir o diagrama.");
    }
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Seus diagramas
        </h1>
        <ButtonLink href="/new">
          <IconPlus size={16} stroke={2.2} />
          Novo diagrama
        </ButtonLink>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <IconFileText
            size={40}
            stroke={1.5}
            className="text-slate-400 dark:text-slate-500"
          />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Você ainda não criou nenhum diagrama.
          </p>
          <ButtonLink href="/new" className="mt-4">
            <IconPlus size={16} stroke={2.2} />
            Criar o primeiro
          </ButtonLink>
        </div>
      ) : (
        <>
          {presentTypes.length > 1 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip
                active={filter === "all"}
                onClick={() => setFilter("all")}
                label="Todos"
              />
              {presentTypes.map((t) => (
                <Chip
                  key={t}
                  active={filter === t}
                  onClick={() => setFilter(t)}
                  label={getDiagramType(t)?.label ?? t}
                />
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((d) => (
              <Link
                key={d.id}
                href={`/diagrams/${d.id}`}
                className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
              >
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, d)}
                  disabled={deletingId === d.id}
                  aria-label="Excluir diagrama"
                  title="Excluir diagrama"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100 disabled:opacity-50 dark:hover:bg-red-500/10"
                >
                  <IconTrash size={15} />
                </button>

                <TypeBadge type={d.type} />
                <p className="mt-3 truncate pr-6 font-medium text-slate-900 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">
                  {d.name}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Editado em {formatDate(d.updatedAt)}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
