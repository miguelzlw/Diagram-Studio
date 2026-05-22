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
          ? `flex h-full w-full items-center justify-center rounded-full bg-pink-600 px-6 text-center text-sm font-semibold text-white shadow-md ${ring}`
          : `flex h-full w-full items-center justify-center rounded-full border border-pink-300 bg-pink-50 px-4 text-center text-sm font-medium text-pink-800 dark:border-pink-500/50 dark:bg-pink-500/10 dark:text-pink-200 ${ring}`
      }
    >
      <Resizer selected={selected} minWidth={100} minHeight={44} />
      <NodeHandles />
      <span className="truncate">{d.label}</span>
    </div>
  );
}

export const MindMapNode = memo(MindMapNodeImpl);
