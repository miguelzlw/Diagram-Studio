"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconFileTypePdf,
  IconCheck,
} from "@tabler/icons-react";
import { TypeBadge } from "@/components/ui/Badge";

interface ToolbarProps {
  name: string;
  onNameChange: (value: string) => void;
  type: string;
  dirty: boolean;
  saving: boolean;
  exporting: boolean;
  onSave: () => void;
  onExport: () => void;
}

export function Toolbar({
  name,
  onNameChange,
  type,
  dirty,
  saving,
  exporting,
  onSave,
  onExport,
}: ToolbarProps) {
  const router = useRouter();
  const [leaveOpen, setLeaveOpen] = useState(false);
  return (
    <header className="flex min-h-16 shrink-0 flex-wrap items-center gap-2 border-b border-outline-variant bg-surface-glass px-3 py-2 backdrop-blur-md">
      <Link
        href="/dashboard"
        onNavigate={(e) => {
          if (dirty || saving) {
            e.preventDefault();
            setLeaveOpen(true);
          }
        }}
        title="Voltar ao dashboard"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-electric"
      >
        <IconArrowLeft size={18} stroke={2} />
      </Link>

      <input
        aria-label="Nome do diagrama"
        maxLength={120}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Sem título"
        className="min-w-0 max-w-xs flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-on-surface outline-none transition-colors placeholder:text-on-surface-muted hover:border-outline-variant focus:border-electric focus:ring-2 focus:ring-electric/20"
      />

      <span className="hidden sm:block"><TypeBadge type={type} /></span>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-glass px-3 py-1.5 text-sm font-semibold text-on-surface backdrop-blur transition-all hover:scale-[1.02] hover:bg-surface-container-high disabled:opacity-60 disabled:hover:scale-100"
        >
          {dirty || saving ? (
            <IconDeviceFloppy size={16} stroke={2} />
          ) : (
            <IconCheck size={16} stroke={2} className="text-emerald-400" />
          )}
          {saving ? "Salvando..." : dirty ? "Salvar" : "Salvo"}
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="btn-electric inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm"
        >
          <IconFileTypePdf size={16} stroke={2} />
          {exporting ? "Exportando..." : "Exportar PDF"}
        </button>
      </div>
      {leaveOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="leave-title" onKeyDown={(e) => { if (e.key === "Escape") setLeaveOpen(false); }} className="w-full max-w-sm rounded-xl border border-outline-variant bg-surface p-5 shadow-xl">
            <h2 id="leave-title" className="font-semibold">Há alterações não salvas</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Se sair agora, as alterações pendentes podem ser perdidas.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button autoFocus type="button" onClick={() => setLeaveOpen(false)} className="rounded-lg border border-outline-variant px-3 py-2 text-sm">Continuar editando</button>
              <button type="button" onClick={() => router.push("/dashboard")} className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400">Sair sem salvar</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
