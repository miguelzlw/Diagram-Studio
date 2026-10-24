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
    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-outline-variant bg-surface-glass p-3 backdrop-blur-md">
      <div className="mb-3 px-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-muted">
          Elementos
        </p>
        <p className="mt-1 text-xs text-on-surface-variant">
          Arraste para o canvas.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {config?.paletteItems.map((item) => (
          <div
            key={item.nodeType}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className="group flex cursor-grab items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface transition-all hover:scale-[1.02] hover:border-electric/40 hover:bg-electric/5 active:cursor-grabbing"
          >
            <IconGripVertical
              size={14}
              className="text-on-surface-muted transition-colors group-hover:text-electric"
            />
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
