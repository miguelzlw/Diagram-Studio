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
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
      <Link
        href="/dashboard"
        title="Voltar ao dashboard"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <IconArrowLeft size={18} stroke={2} />
      </Link>

      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Sem título"
        className="min-w-0 max-w-xs flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-slate-900 outline-none hover:border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:text-slate-100 dark:hover:border-slate-700 dark:focus:ring-indigo-500/20"
      />

      <TypeBadge type={type} />

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {dirty || saving ? (
            <IconDeviceFloppy size={16} stroke={2} />
          ) : (
            <IconCheck size={16} stroke={2} />
          )}
          {saving ? "Salvando..." : dirty ? "Salvar" : "Salvo"}
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          <IconFileTypePdf size={16} stroke={2} />
          {exporting ? "Exportando..." : "Exportar PDF"}
        </button>
      </div>
    </header>
  );
}
