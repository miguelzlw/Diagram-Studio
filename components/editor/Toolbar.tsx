"use client";

import Link from "next/link";
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
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-outline-variant bg-surface-glass px-4 backdrop-blur-md">
      <Link
        href="/dashboard"
        title="Voltar ao dashboard"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-electric"
      >
        <IconArrowLeft size={18} stroke={2} />
      </Link>

      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Sem título"
        className="min-w-0 max-w-xs flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-on-surface outline-none transition-colors placeholder:text-on-surface-muted hover:border-outline-variant focus:border-electric focus:ring-2 focus:ring-electric/20"
      />

      <TypeBadge type={type} />

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
    </header>
  );
}
