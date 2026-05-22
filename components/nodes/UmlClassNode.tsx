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
      className={`flex h-full w-full flex-col overflow-hidden rounded-md border border-slate-400 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800 ${selectionRing(
        !!selected,
      )}`}
    >
      <Resizer selected={selected} minWidth={140} minHeight={110} />
      <NodeHandles />
      <div className="border-b border-slate-300 bg-slate-50 px-3 py-1.5 text-center dark:border-slate-600 dark:bg-slate-900">
        {isInterface && (
          <div className="text-[10px] italic text-slate-500 dark:text-slate-400">
            «interface»
          </div>
        )}
        <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {d.label}
        </div>
      </div>
      <div className="flex-1 overflow-auto border-b border-slate-200 px-3 py-1.5 dark:border-slate-700">
        {attributes.length === 0 ? (
          <div className="text-[11px] italic text-slate-300 dark:text-slate-600">
            atributos
          </div>
        ) : (
          attributes.map((a, i) => (
            <div
              key={i}
              className="font-mono text-[11px] text-slate-700 dark:text-slate-300"
            >
              {a}
            </div>
          ))
        )}
      </div>
      <div className="flex-1 overflow-auto px-3 py-1.5">
        {methods.length === 0 ? (
          <div className="text-[11px] italic text-slate-300 dark:text-slate-600">
            métodos
          </div>
        ) : (
          methods.map((m, i) => (
            <div
              key={i}
              className="font-mono text-[11px] text-slate-700 dark:text-slate-300"
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
