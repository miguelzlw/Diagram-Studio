"use client";

import {
  getBezierPath,
  type ConnectionLineComponentProps,
} from "@xyflow/react";

/** Linha de conexão durante o arraste: vermelha quando o alvo é inválido. */
export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const color =
    connectionStatus === "invalid"
      ? "#ef4444"
      : connectionStatus === "valid"
        ? "#22c55e"
        : "#6366f1";

  const [path] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <circle cx={toX} cy={toY} r={3} fill={color} stroke="white" />
    </g>
  );
}
