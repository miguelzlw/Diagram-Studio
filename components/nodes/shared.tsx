"use client";

import { Handle, NodeResizer, Position } from "@xyflow/react";

export interface ColumnDef {
  id: string;
  name: string;
  key: "none" | "PK" | "FK";
}

export interface DiagramNodeData {
  /** Subtipo do nó dentro do tipo de diagrama (ex.: "process", "decision"). */
  nodeType: string;
  label: string;
  /** UML Classes: atributos e métodos. */
  attributes?: string[];
  methods?: string[];
  /** Banco de dados: colunas da tabela. */
  columns?: ColumnDef[];
  [key: string]: unknown;
}

const HANDLE_CLASS =
  "!h-3 !w-3 !rounded-full !border-2 !border-[#3b82f6] !bg-white transition-all hover:!scale-125 hover:!bg-[#3b82f6] hover:!shadow-[0_0_12px_rgba(59,130,246,0.6)] dark:!bg-[#0b1326]";

export function NodeHandles({
  source = true,
  target = true,
}: {
  source?: boolean;
  target?: boolean;
}) {
  return (
    <>
      {target && (
        <Handle
          type="target"
          position={Position.Top}
          className={HANDLE_CLASS}
        />
      )}
      {source && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={HANDLE_CLASS}
        />
      )}
    </>
  );
}

/** Controles de redimensionamento, visíveis quando o nó está selecionado. */
export function Resizer({
  selected,
  minWidth = 90,
  minHeight = 44,
}: {
  selected?: boolean;
  minWidth?: number;
  minHeight?: number;
}) {
  return (
    <NodeResizer
      isVisible={!!selected}
      minWidth={minWidth}
      minHeight={minHeight}
      lineClassName="!border-[#3b82f6]"
      handleClassName="!h-2.5 !w-2.5 !rounded-[3px] !border-2 !border-white !bg-[#3b82f6] dark:!border-[#0b1326]"
    />
  );
}

export function selectionRing(selected: boolean) {
  return selected
    ? "ring-2 ring-[#3b82f6] ring-offset-2 ring-offset-[var(--bg)] shadow-[0_0_24px_rgba(59,130,246,0.25)]"
    : "";
}
