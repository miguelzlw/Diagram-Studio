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
        "rounded-full border-2 border-emerald-500/70 bg-emerald-500/15 shadow-[0_0_16px_rgba(16,185,129,0.15)]";
      break;
    case "end":
      shapeClass +=
        "rounded-full border-2 border-red-500/70 bg-red-500/15 shadow-[0_0_16px_rgba(239,68,68,0.15)]";
      break;
    case "decision":
      shapeClass +=
        "rotate-45 border-2 border-amber-500/70 bg-amber-500/15 shadow-[0_0_16px_rgba(245,158,11,0.15)]";
      labelStyle = { transform: "rotate(-45deg)" };
      break;
    case "io":
      shapeClass +=
        "border-2 border-cyan-500/70 bg-cyan-500/15 shadow-[0_0_16px_rgba(6,182,212,0.15)]";
      shapeStyle = { transform: "skewX(-14deg)" };
      labelStyle = { transform: "skewX(14deg)" };
      break;
    default:
      shapeClass +=
        "rounded-md border border-outline-variant bg-surface-container inner-glow";
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
          className="px-2 text-center text-sm font-semibold text-on-surface"
          style={labelStyle}
        >
          {d.label}
        </span>
      </div>
    </div>
  );
}

export const FlowchartNode = memo(FlowchartNodeImpl);
