"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import {
  NodeHandles,
  Resizer,
  selectionRing,
  type DiagramNodeData,
} from "./shared";

function FlowchartNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;

  let shapeClass = "absolute inset-0 flex items-center justify-center ";
  let shapeStyle: React.CSSProperties | undefined;
  let labelStyle: React.CSSProperties | undefined;

  switch (d.nodeType) {
    case "start":
      shapeClass +=
        "rounded-full border-2 border-emerald-400 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10";
      break;
    case "end":
      shapeClass +=
        "rounded-full border-2 border-red-400 bg-red-50 dark:border-red-500/60 dark:bg-red-500/10";
      break;
    case "decision":
      shapeClass +=
        "rotate-45 border-2 border-amber-400 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/10";
      labelStyle = { transform: "rotate(-45deg)" };
      break;
    case "io":
      shapeClass +=
        "border-2 border-sky-400 bg-sky-50 dark:border-sky-500/60 dark:bg-sky-500/10";
      shapeStyle = { transform: "skewX(-14deg)" };
      labelStyle = { transform: "skewX(14deg)" };
      break;
    default:
      shapeClass +=
        "rounded-md border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800";
  }

  return (
    <div className={`relative h-full w-full ${selectionRing(!!selected)}`}>
      <Resizer selected={selected} minWidth={80} minHeight={56} />
      <NodeHandles
        target={d.nodeType !== "start"}
        source={d.nodeType !== "end"}
      />
      <div className={shapeClass} style={shapeStyle}>
        <span
          className="px-2 text-center text-sm font-medium text-slate-800 dark:text-slate-100"
          style={labelStyle}
        >
          {d.label}
        </span>
      </div>
    </div>
  );
}

export const FlowchartNode = memo(FlowchartNodeImpl);
