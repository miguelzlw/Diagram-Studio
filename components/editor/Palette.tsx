"use client";

import { IconGripVertical } from "@tabler/icons-react";
import { getDiagramType, type PaletteItem } from "@/lib/diagram-types";

export function Palette({ diagramType }: { diagramType: string }) {
  const config = getDiagramType(diagramType);

  function onDragStart(e: React.DragEvent, item: PaletteItem) {
    e.dataTransfer.setData("application/diagram-node", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <aside className="w-52 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        Elementos
      </p>
      <p className="mt-1 px-1 text-xs text-slate-400 dark:text-slate-500">
        Arraste para o canvas.
      </p>

      <div className="mt-3 flex flex-col gap-1.5">
        {config?.paletteItems.map((item) => (
          <div
            key={item.nodeType}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className="flex cursor-grab items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10"
          >
            <IconGripVertical
              size={15}
              className="text-slate-300 dark:text-slate-600"
            />
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
