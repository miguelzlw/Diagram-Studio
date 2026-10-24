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
          className="shrink-0 text-on-surface"
        />
        <span className="mt-0.5 truncate text-xs font-semibold text-on-surface">
          {d.label}
        </span>
      </div>
    );
  }

  if (d.nodeType === "system") {
    return (
      <div
        className={`inner-glow h-full w-full rounded-lg border-2 border-dashed border-outline bg-surface-container/40 backdrop-blur-sm ${ring}`}
      >
        <Resizer selected={selected} minWidth={200} minHeight={150} />
        <NodeHandles />
        <div className="truncate px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {d.label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inner-glow flex h-full w-full items-center justify-center rounded-[50%] border-2 border-amber-500/60 bg-amber-500/15 px-5 shadow-[0_0_16px_rgba(245,158,11,0.15)] ${ring}`}
    >
      <Resizer selected={selected} minWidth={120} minHeight={64} />
      <NodeHandles />
      <span className="truncate text-center text-sm font-semibold text-on-surface">
        {d.label}
      </span>
    </div>
  );
}

export const UmlUseCaseNode = memo(UmlUseCaseNodeImpl);
