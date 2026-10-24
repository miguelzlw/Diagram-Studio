"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { IconKey, IconLink } from "@tabler/icons-react";
import {
  Resizer,
  selectionRing,
  type DiagramNodeData,
  type ColumnDef,
} from "./shared";

const HEADER_H = 34;
const ROW_H = 28;
const HANDLE_CLASS =
  "!h-3 !w-3 !rounded-full !border-2 !border-[#3b82f6] !bg-white transition-all hover:!scale-125 hover:!bg-[#3b82f6] hover:!shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:!bg-[#0b1326]";

function DatabaseTableNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const columns: ColumnDef[] = d.columns ?? [];

  return (
    <div
      className={`inner-glow h-full w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container shadow-sm ${selectionRing(
        !!selected,
      )}`}
    >
      <Resizer selected={selected} minWidth={160} minHeight={90} />
      <div
        className="flex items-center bg-gradient-to-r from-cyan-600 to-cyan-500 px-3 text-sm font-bold text-white"
        style={{ height: HEADER_H }}
      >
        <span className="truncate">{d.label}</span>
      </div>

      {columns.length === 0 ? (
        <div className="px-3 py-2 font-mono text-[10px] italic text-on-surface-muted">
          sem colunas
        </div>
      ) : (
        columns.map((col, i) => (
          <div
            key={col.id}
            className="flex items-center gap-1.5 border-t border-outline-variant px-3"
            style={{ height: ROW_H }}
          >
            {col.key === "PK" && (
              <IconKey size={13} className="shrink-0 text-amber-400" />
            )}
            {col.key === "FK" && (
              <IconLink size={13} className="shrink-0 text-purple-400" />
            )}
            <span className="truncate font-mono text-[11px] text-on-surface">
              {col.name}
            </span>

            <Handle
              type="target"
              id={`${col.id}-t`}
              position={Position.Left}
              className={HANDLE_CLASS}
              style={{ top: HEADER_H + i * ROW_H + ROW_H / 2 }}
            />
            <Handle
              type="source"
              id={`${col.id}-s`}
              position={Position.Right}
              className={HANDLE_CLASS}
              style={{ top: HEADER_H + i * ROW_H + ROW_H / 2 }}
            />
          </div>
        ))
      )}
    </div>
  );
}

export const DatabaseTableNode = memo(DatabaseTableNodeImpl);
