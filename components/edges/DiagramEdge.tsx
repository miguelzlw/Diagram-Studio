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
  const stroke = selected ? "#6366f1" : "#94a3b8";

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerStart={d.markerStart ? `url(#dg-${d.markerStart})` : undefined}
        markerEnd={d.markerEnd ? `url(#dg-${d.markerEnd})` : undefined}
        style={{
          stroke,
          strokeWidth: selected ? 2 : 1.5,
          strokeDasharray: d.dashed ? "6 4" : undefined,
        }}
      />
      {d.label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan absolute rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
