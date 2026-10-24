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
        ? "#10b981"
        : "#3b82f6";

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
        style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
      />
      <circle cx={toX} cy={toY} r={4} fill={color} stroke="white" strokeWidth={1.5} />
    </g>
  );
}
