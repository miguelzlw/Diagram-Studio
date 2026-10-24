"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import {
  NodeHandles,
  Resizer,
  selectionRing,
  type DiagramNodeData,
} from "./shared";

function UmlClassNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const isInterface = d.nodeType === "interface";
  const attributes = (d.attributes ?? []).filter((a) => a.trim() !== "");
  const methods = (d.methods ?? []).filter((m) => m.trim() !== "");

  return (
    <div
      className={`inner-glow flex h-full w-full flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container shadow-sm ${selectionRing(
        !!selected,
      )}`}
    >
      <Resizer selected={selected} minWidth={140} minHeight={110} />
      <NodeHandles />
      <div className="border-b border-outline-variant bg-surface-container-high px-3 py-1.5 text-center">
        {isInterface && (
          <div className="font-mono text-[9px] uppercase italic tracking-wider text-purple-400">
            «interface»
          </div>
        )}
        <div className="truncate text-sm font-bold text-on-surface">
          {d.label}
        </div>
      </div>
      <div className="flex-1 overflow-auto border-b border-outline-variant px-3 py-1.5">
        {attributes.length === 0 ? (
          <div className="font-mono text-[10px] italic text-on-surface-muted">
            atributos
          </div>
        ) : (
          attributes.map((a, i) => (
            <div
              key={i}
              className="font-mono text-[11px] text-on-surface-variant"
            >
              {a}
            </div>
          ))
        )}
      </div>
      <div className="flex-1 overflow-auto px-3 py-1.5">
        {methods.length === 0 ? (
          <div className="font-mono text-[10px] italic text-on-surface-muted">
            métodos
          </div>
        ) : (
          methods.map((m, i) => (
            <div
              key={i}
              className="font-mono text-[11px] text-on-surface-variant"
            >
              {m}()
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export const UmlClassNode = memo(UmlClassNodeImpl);
