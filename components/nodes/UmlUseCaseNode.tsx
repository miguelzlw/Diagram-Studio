"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { IconUser } from "@tabler/icons-react";
import {
  NodeHandles,
  Resizer,
  selectionRing,
  type DiagramNodeData,
} from "./shared";

function UmlUseCaseNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const ring = selectionRing(!!selected);

  if (d.nodeType === "actor") {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center rounded-md ${ring}`}
      >
        <Resizer selected={selected} minWidth={70} minHeight={84} />
        <NodeHandles />
        <IconUser
          size={40}
          stroke={1.6}
          className="shrink-0 text-slate-700 dark:text-slate-200"
        />
        <span className="mt-0.5 truncate text-xs font-medium text-slate-800 dark:text-slate-100">
          {d.label}
        </span>
      </div>
    );
  }

  if (d.nodeType === "system") {
    return (
      <div
        className={`h-full w-full rounded-lg border-2 border-slate-300 bg-slate-50/60 dark:border-slate-600 dark:bg-slate-800/40 ${ring}`}
      >
        <Resizer selected={selected} minWidth={200} minHeight={150} />
        <NodeHandles />
        <div className="truncate px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {d.label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-[50%] border-2 border-amber-400 bg-amber-50 px-5 dark:border-amber-500/60 dark:bg-amber-500/10 ${ring}`}
    >
      <Resizer selected={selected} minWidth={120} minHeight={64} />
      <NodeHandles />
      <span className="truncate text-center text-sm font-medium text-slate-800 dark:text-slate-100">
        {d.label}
      </span>
    </div>
  );
}

export const UmlUseCaseNode = memo(UmlUseCaseNodeImpl);
