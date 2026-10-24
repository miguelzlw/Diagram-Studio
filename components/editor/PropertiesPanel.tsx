"use client";

import type { Node, Edge } from "@xyflow/react";
import { IconPlus, IconTrash, IconSettings2 } from "@tabler/icons-react";
import { getDiagramType } from "@/lib/diagram-types";
import { getEdgeOptions, type DiagramEdgeData } from "@/lib/edge-config";
import type { ColumnDef, DiagramNodeData } from "@/components/nodes/shared";

const FIELD_CLASS =
  "w-full rounded-md border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-electric focus:ring-2 focus:ring-electric/20 placeholder:text-on-surface-muted";
const LABEL_CLASS =
  "font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-muted";

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
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-l border-outline-variant bg-surface-glass p-4 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-electric-soft text-electric">
          <IconSettings2 size={14} stroke={2} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-on-surface">Propriedades</h2>
          <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-muted">
            {selectedNode
              ? "Nó selecionado"
              : selectedEdge
              ? "Conexão selecionada"
              : "Metadados"}
          </p>
        </div>
      </div>

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
      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>Nome</span>
        <input
          value={data.label}
          onChange={(e) => onUpdateNode(node.id, { label: e.target.value })}
          className={FIELD_CLASS}
        />
      </label>

      {isUmlClass && (
        <>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Atributos (um por linha)</span>
            <textarea
              rows={4}
              value={(data.attributes ?? []).join("\n")}
              onChange={(e) =>
                onUpdateNode(node.id, {
                  attributes: e.target.value.split("\n"),
                })
              }
              className={`${FIELD_CLASS} resize-y font-mono text-xs`}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Métodos (um por linha)</span>
            <textarea
              rows={4}
              value={(data.methods ?? []).join("\n")}
              onChange={(e) =>
                onUpdateNode(node.id, {
                  methods: e.target.value.split("\n"),
                })
              }
              className={`${FIELD_CLASS} resize-y font-mono text-xs`}
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-on-surface-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
          >
            <IconTrash size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-dashed border-outline-variant py-2 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant transition-all hover:border-electric/50 hover:text-electric"
      >
        <IconPlus size={12} />
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
    <div className="flex flex-col gap-4">
      {options.length > 1 ? (
        <label className="flex flex-col gap-1.5">
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
        <p className="text-xs text-on-surface-variant">
          Este tipo de diagrama usa um único tipo de conexão.
        </p>
      )}

      <p className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-xs text-on-surface-variant">
        Pressione <kbd className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-on-surface">Delete</kbd>{" "}
        para remover esta conexão.
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
      <Row label="Nome" value={name || "Sem título"} />
      <Row label="Tipo" value={config?.label ?? type} />
      <Row label="Elementos" value={String(nodeCount)} />
      <Row label="Conexões" value={String(edgeCount)} />
      <p className="mt-3 rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-xs text-on-surface-variant">
        Selecione um elemento para editar suas propriedades.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-outline-variant/60 bg-surface-container/60 px-3 py-2 text-sm">
      <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-muted">
        {label}
      </span>
      <span className="font-semibold text-on-surface">{value}</span>
    </div>
  );
}
