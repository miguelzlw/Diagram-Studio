"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconPlus,
  IconFileText,
  IconTrash,
  IconArrowRight,
  IconClock,
} from "@tabler/icons-react";
import { TypeBadge } from "@/components/ui/Badge";
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
    try {
      const res = await fetch(`/api/diagrams/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((d) => d.id !== item.id));
        setFilter("all");
      } else {
        window.alert("Não foi possível excluir o diagrama.");
      }
    } catch {
      window.alert("Não foi possível excluir o diagrama. Verifique sua conexão.");
    } finally {
      setDeletingId(null);
    }
  }

  const featured = items[0];

  return (
    <div className="ambient-mesh">
      {/* Cabeçalho */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
          Bem-vindo de volta.
        </h1>
        <p className="mt-2 text-base text-on-surface-variant">
          Aqui está o que está acontecendo no seu workspace.
        </p>
      </header>

      {/* Bento: Novo + Destaque */}
      <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link
          href="/new"
          className="group glass inner-glow relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-electric/50"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-electric/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-outline-variant/60 bg-surface-container transition-colors group-hover:border-electric/50">
            <IconPlus size={26} stroke={2} className="text-electric" />
          </div>
          <div className="z-10">
            <h3 className="text-xl font-bold text-on-surface">Criar Novo</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Comece um diagrama em branco
            </p>
          </div>
        </Link>

        {featured ? (
          <Link
            href={`/diagrams/${featured.id}`}
            className="group glass inner-glow relative flex h-48 overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:border-electric/40 md:col-span-2"
          >
            <div className="relative w-1/3 overflow-hidden border-r border-outline-variant/40 bg-surface-container-highest">
              <div className="bg-dot-grid absolute inset-0 opacity-30" />
              <div className="absolute left-4 top-4 flex h-8 w-16 items-center justify-center rounded border border-outline-variant bg-surface font-mono text-[9px] text-on-surface-variant">
                Node A
              </div>
              <div className="absolute left-7 top-16 flex h-10 w-20 items-center justify-center rounded border border-electric/40 bg-surface font-mono text-[9px] text-electric shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                Node B
              </div>
              <svg
                className="absolute left-0 top-0 h-full w-full text-outline-variant/60"
                preserveAspectRatio="none"
              >
                <path
                  d="M 48 24 Q 48 44 60 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-bold text-on-surface">
                    {featured.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-muted">
                    <IconClock size={12} stroke={2} />
                    Editado em {formatDate(featured.updatedAt)}
                  </div>
                </div>
                <TypeBadge type={featured.type} />
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-electric opacity-0 transition-opacity group-hover:opacity-100">
                Abrir diagrama
                <IconArrowRight size={14} stroke={2} />
              </div>
            </div>
          </Link>
        ) : (
          <div className="glass inner-glow flex h-48 items-center justify-center rounded-2xl text-sm text-on-surface-variant md:col-span-2">
            Crie seu primeiro diagrama para vê-lo em destaque.
          </div>
        )}
      </div>

      {/* Lista */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Seus diagramas</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {items.length} {items.length === 1 ? "diagrama" : "diagramas"} no
            total
          </p>
        </div>
      </div>

      {presentTypes.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
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

      {items.length === 0 ? (
        <div className="glass inner-glow mt-6 flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-outline-variant bg-surface-container">
            <IconFileText
              size={28}
              stroke={1.6}
              className="text-on-surface-muted"
            />
          </div>
          <p className="mt-4 text-base text-on-surface">
            Você ainda não criou nenhum diagrama.
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Clique em &quot;Criar Novo&quot; acima para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <Link
              key={d.id}
              href={`/diagrams/${d.id}`}
              className="group glass inner-glow relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-electric/40"
            >
              <div className="relative h-32 overflow-hidden border-b border-outline-variant/40 bg-surface-container-highest">
                <div className="bg-dot-grid absolute inset-0 opacity-25" />
                <div className="flex h-full items-center justify-center gap-3 opacity-50 transition-opacity group-hover:opacity-100">
                  <div className="h-10 w-10 rounded border border-outline-variant bg-surface" />
                  <div className="h-10 w-10 rounded border border-electric/40 bg-surface shadow-[0_0_10px_rgba(59,130,246,0.18)]" />
                  <div className="h-10 w-10 rounded border border-outline-variant bg-surface" />
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDelete(e, d)}
                  disabled={deletingId === d.id}
                  aria-label="Excluir diagrama"
                  title="Excluir diagrama"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-surface-glass-strong text-on-surface-muted opacity-0 backdrop-blur transition-all hover:bg-red-500/20 hover:text-red-400 focus:opacity-100 group-hover:opacity-100 disabled:opacity-50"
                >
                  <IconTrash size={14} />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <TypeBadge type={d.type} />
                </div>
                <h4 className="truncate font-semibold text-on-surface group-hover:text-electric">
                  {d.name}
                </h4>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-muted">
                    {formatDate(d.updatedAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
      className={`rounded-full px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-all ${
        active
          ? "bg-electric text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
          : "border border-outline-variant bg-surface-glass text-on-surface-variant backdrop-blur hover:border-electric/40 hover:text-on-surface"
      }`}
    >
      {label}
    </button>
  );
}
