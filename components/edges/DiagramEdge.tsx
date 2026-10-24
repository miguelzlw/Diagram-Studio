"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { DiagramEdgeData } from "@/lib/edge-config";

function DiagramEdgeImpl({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const d = (data ?? {}) as DiagramEdgeData;
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const stroke = selected ? "#3b82f6" : "#64748b";

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerStart={d.markerStart ? `url(#dg-${d.markerStart})` : undefined}
        markerEnd={d.markerEnd ? `url(#dg-${d.markerEnd})` : undefined}
        style={{
          stroke,
          strokeWidth: selected ? 2.5 : 1.5,
          strokeDasharray: d.dashed ? "6 4" : undefined,
          filter: selected ? "drop-shadow(0 0 6px rgba(59,130,246,0.5))" : undefined,
        }}
      />
      {d.label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan glass absolute rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-on-surface-variant shadow-sm"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {d.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const DiagramEdge = memo(DiagramEdgeImpl);
