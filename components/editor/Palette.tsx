"use client";

import { IconGripVertical } from "@tabler/icons-react";
import { useReactFlow } from "@xyflow/react";
import { getDiagramType, type PaletteItem } from "@/lib/diagram-types";

export function Palette({ diagramType, onAdd }: { diagramType: string; onAdd: (type: string, label: string, position: { x: number; y: number }) => void }) {
  const { screenToFlowPosition } = useReactFlow();
  const config = getDiagramType(diagramType);

  function onDragStart(e: React.DragEvent, item: PaletteItem) {
    e.dataTransfer.setData("application/diagram-node", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <aside className="flex w-full shrink-0 flex-col overflow-auto border-b border-outline-variant bg-surface-glass p-3 backdrop-blur-md lg:w-56 lg:border-b-0 lg:border-r">
      <div className="mb-3 px-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-muted">
          Elementos
        </p>
        <p className="mt-1 text-xs text-on-surface-variant">
          Clique ou arraste para o canvas.
        </p>
      </div>

      <div className="flex gap-1.5 lg:flex-col">
        {config?.paletteItems.map((item) => (
          <button
            type="button"
            onClick={() => {
              const rect = document.querySelector(".react-flow")?.getBoundingClientRect();
              if (rect) onAdd(item.nodeType, item.label, screenToFlowPosition({ x: rect.x + rect.width / 2 - 60, y: rect.y + rect.height / 2 - 30 }));
            }}
            key={item.nodeType}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className="group flex shrink-0 cursor-grab items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface transition-all hover:scale-[1.02] hover:border-electric/40 hover:bg-electric/5 active:cursor-grabbing"
          >
            <IconGripVertical
              size={14}
              className="text-on-surface-muted transition-colors group-hover:text-electric"
            />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
