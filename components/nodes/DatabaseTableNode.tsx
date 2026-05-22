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
  "!h-3 !w-3 !rounded-full !border-2 !border-white !bg-indigo-400 hover:!bg-indigo-500 dark:!border-slate-900";

function DatabaseTableNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const columns: ColumnDef[] = d.columns ?? [];

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-md border border-sky-400 bg-white shadow-sm dark:border-sky-500/60 dark:bg-slate-800 ${selectionRing(
        !!selected,
      )}`}
    >
      <Resizer selected={selected} minWidth={160} minHeight={90} />
      <div
        className="flex items-center bg-sky-500 px-3 text-sm font-semibold text-white"
        style={{ height: HEADER_H }}
      >
        <span className="truncate">{d.label}</span>
      </div>

      {columns.length === 0 ? (
        <div className="px-3 py-2 text-[11px] italic text-slate-300 dark:text-slate-600">
          sem colunas
        </div>
      ) : (
        columns.map((col, i) => (
          <div
            key={col.id}
            className="flex items-center gap-1.5 border-t border-slate-100 px-3 dark:border-slate-700"
            style={{ height: ROW_H }}
          >
            {col.key === "PK" && (
              <IconKey size={13} className="shrink-0 text-amber-500" />
            )}
            {col.key === "FK" && (
              <IconLink size={13} className="shrink-0 text-violet-500" />
            )}
            <span className="truncate font-mono text-[11px] text-slate-700 dark:text-slate-200">
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
