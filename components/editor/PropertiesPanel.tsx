"use client";

import type { Node, Edge } from "@xyflow/react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { getDiagramType } from "@/lib/diagram-types";
import { getEdgeOptions, type DiagramEdgeData } from "@/lib/edge-config";
import type { ColumnDef, DiagramNodeData } from "@/components/nodes/shared";

const FIELD_CLASS =
  "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20";
const LABEL_CLASS =
  "text-xs font-medium text-slate-500 dark:text-slate-400";

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  diagramName: string;
  diagramType: string;
  nodeCount: number;
  edgeCount: number;
  onUpdateNode: (id: string, patch: Partial<DiagramNodeData>) => void;
  onUpdateEdge: (id: string, relationId: string) => void;
}

export function PropertiesPanel({
  selectedNode,
  selectedEdge,
  diagramName,
  diagramType,
  nodeCount,
  edgeCount,
  onUpdateNode,
  onUpdateEdge,
}: PropertiesPanelProps) {
  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {selectedNode ? (
        <NodeProperties node={selectedNode} onUpdateNode={onUpdateNode} />
      ) : selectedEdge ? (
        <EdgeProperties
          edge={selectedEdge}
          diagramType={diagramType}
          onUpdateEdge={onUpdateEdge}
        />
      ) : (
        <Metadata
          name={diagramName}
          type={diagramType}
          nodeCount={nodeCount}
          edgeCount={edgeCount}
        />
      )}
    </aside>
  );
}

function NodeProperties({
  node,
  onUpdateNode,
}: {
  node: Node;
  onUpdateNode: (id: string, patch: Partial<DiagramNodeData>) => void;
}) {
  const data = node.data as DiagramNodeData;
  const isUmlClass = data.nodeType === "class" || data.nodeType === "interface";
  const isTable = data.nodeType === "table";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Propriedades do elemento
      </h2>

      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASS}>Nome</span>
        <input
          value={data.label}
          onChange={(e) => onUpdateNode(node.id, { label: e.target.value })}
          className={FIELD_CLASS}
        />
      </label>

      {isUmlClass && (
        <>
          <label className="flex flex-col gap-1">
            <span className={LABEL_CLASS}>Atributos (um por linha)</span>
            <textarea
              rows={4}
              value={(data.attributes ?? []).join("\n")}
              onChange={(e) =>
                onUpdateNode(node.id, {
                  attributes: e.target.value.split("\n"),
                })
              }
              className={`${FIELD_CLASS} resize-y font-mono`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={LABEL_CLASS}>Métodos (um por linha)</span>
            <textarea
              rows={4}
              value={(data.methods ?? []).join("\n")}
              onChange={(e) =>
                onUpdateNode(node.id, {
                  methods: e.target.value.split("\n"),
                })
              }
              className={`${FIELD_CLASS} resize-y font-mono`}
            />
          </label>
        </>
      )}

      {isTable && (
        <ColumnsEditor
          columns={data.columns ?? []}
          onChange={(columns) => onUpdateNode(node.id, { columns })}
        />
      )}
    </div>
  );
}

function ColumnsEditor({
  columns,
  onChange,
}: {
  columns: ColumnDef[];
  onChange: (columns: ColumnDef[]) => void;
}) {
  function update(id: string, patch: Partial<ColumnDef>) {
    onChange(columns.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function add() {
    onChange([
      ...columns,
      { id: crypto.randomUUID(), name: "coluna", key: "none" },
    ]);
  }
  function remove(id: string) {
    onChange(columns.filter((c) => c.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      <span className={LABEL_CLASS}>Colunas</span>
      {columns.map((col) => (
        <div key={col.id} className="flex items-center gap-1">
          <input
            value={col.name}
            onChange={(e) => update(col.id, { name: e.target.value })}
            className={`${FIELD_CLASS} flex-1`}
          />
          <select
            value={col.key}
            onChange={(e) =>
              update(col.id, { key: e.target.value as ColumnDef["key"] })
            }
            className={`${FIELD_CLASS} w-16 px-1`}
          >
            <option value="none">—</option>
            <option value="PK">PK</option>
            <option value="FK">FK</option>
          </select>
          <button
            type="button"
            onClick={() => remove(col.id)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          >
            <IconTrash size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 py-1.5 text-xs font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300"
      >
        <IconPlus size={14} />
        Adicionar coluna
      </button>
    </div>
  );
}

function EdgeProperties({
  edge,
  diagramType,
  onUpdateEdge,
}: {
  edge: Edge;
  diagramType: string;
  onUpdateEdge: (id: string, relationId: string) => void;
}) {
  const options = getEdgeOptions(diagramType);
  const data = (edge.data ?? {}) as DiagramEdgeData;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Conexão selecionada
      </h2>

      {options.length > 1 ? (
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASS}>Tipo de relacionamento</span>
          <select
            value={data.relation ?? options[0]?.id ?? ""}
            onChange={(e) => onUpdateEdge(edge.id, e.target.value)}
            className={FIELD_CLASS}
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Este tipo de diagrama usa um único tipo de conexão.
        </p>
      )}

      <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Pressione Delete para remover esta conexão.
      </p>
    </div>
  );
}

function Metadata({
  name,
  type,
  nodeCount,
  edgeCount,
}: {
  name: string;
  type: string;
  nodeCount: number;
  edgeCount: number;
}) {
  const config = getDiagramType(type);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Diagrama
      </h2>
      <Row label="Nome" value={name || "Sem título"} />
      <Row label="Tipo" value={config?.label ?? type} />
      <Row label="Elementos" value={String(nodeCount)} />
      <Row label="Conexões" value={String(edgeCount)} />
      <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Selecione um elemento para editar suas propriedades.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}
