"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import {
  NodeHandles,
  Resizer,
  selectionRing,
  type DiagramNodeData,
} from "./shared";

function MindMapNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const ring = selectionRing(!!selected);
  const isCentral = d.nodeType === "central";

  return (
    <div
      className={
        isCentral
          ? `flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-purple-600 px-6 text-center text-sm font-bold text-white shadow-[0_0_24px_rgba(168,85,247,0.4)] ${ring}`
          : `inner-glow flex h-full w-full items-center justify-center rounded-full border border-pink-500/50 bg-pink-500/15 px-4 text-center text-sm font-semibold text-on-surface ${ring}`
      }
    >
      <Resizer selected={selected} minWidth={100} minHeight={44} />
      <NodeHandles />
      <span className="truncate">{d.label}</span>
    </div>
  );
}

export const MindMapNode = memo(MindMapNodeImpl);
