"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type OnConnectEnd,
  type OnSelectionChangeFunc,
  type IsValidConnection,
  type XYPosition,
} from "@xyflow/react";
import { Toolbar } from "./Toolbar";
import { createSaveTracker } from "@/lib/save-tracker";
import { Palette } from "./Palette";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { MarkerDefs } from "@/components/edges/MarkerDefs";
import { defaultNodeData, defaultNodeSize } from "@/lib/node-factory";
import { exportDiagramToPdf } from "@/lib/export-pdf";
import { buildEdgeData, DEFAULT_RELATION } from "@/lib/edge-config";
import { validateConnection } from "@/lib/validation";
import type { DiagramNodeData } from "@/components/nodes/shared";

export interface EditorDiagram {
  id: string;
  name: string;
  type: string;
  nodes: Node[];
  edges: Edge[];
}

function serialize(nodes: Node[], edges: Edge[]): string {
  return JSON.stringify({
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
      width: n.width,
      height: n.height,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? null,
      targetHandle: e.targetHandle ?? null,
      type: e.type,
      data: e.data,
    })),
  });
}

function EditorInner({ diagram }: { diagram: EditorDiagram }) {
  const { getNodesBounds } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(diagram.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(diagram.edges);
  const [name, setName] = useState(diagram.name);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const trackerRef = useRef(createSaveTracker());
  const markDirty = useCallback(() => {
    trackerRef.current.edit();
    setDirty(true);
  }, []);

  const stateRef = useRef({ nodes, edges, name, dirty });

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      if (changes.some((c) => c.type === "dimensions" ? c.resizing === true : c.type !== "select")) {
        markDirty();
      }
    },
    [onNodesChange, markDirty],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      if (changes.some((c) => c.type !== "select")) markDirty();
    },
    [onEdgesChange, markDirty],
  );

  const onConnect = useCallback(
    (conn: Connection) => {
      const dt = diagram.type;
      const { nodes: curNodes, edges: curEdges } = stateRef.current;

      let relation = DEFAULT_RELATION[dt] ?? "";
      if (dt === "flowchart") {
        const src = curNodes.find((n) => n.id === conn.source);
        if ((src?.data as DiagramNodeData | undefined)?.nodeType === "decision") {
          const outCount = curEdges.filter(
            (e) => e.source === conn.source,
          ).length;
          relation = outCount === 0 ? "yes" : "no";
        }
      }

      const newEdge: Edge = {
        id: crypto.randomUUID(),
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle ?? null,
        targetHandle: conn.targetHandle ?? null,
        type: "diagram",
        data: buildEdgeData(dt, relation),
      };
      setEdges((eds) => [...eds, newEdge]);

      // Banco de dados: a coluna de destino vira chave estrangeira (FK).
      if (dt === "database" && conn.targetHandle && conn.target) {
        setNodes((ns) =>
          ns.map((n) => {
            if (n.id !== conn.target) return n;
            const data = n.data as DiagramNodeData;
            const columns = (data.columns ?? []).map((c) =>
              `${c.id}-t` === conn.targetHandle && c.key !== "PK"
                ? { ...c, key: "FK" as const }
                : c,
            );
            return { ...n, data: { ...data, columns } };
          }),
        );
      }
      markDirty();
    },
    [diagram.type, setEdges, setNodes, markDirty],
  );

  const isValidConnection = useCallback<IsValidConnection>(
    (conn) => {
      const { nodes: n, edges: e } = stateRef.current;
      return validateConnection(diagram.type, conn as Connection, n, e).valid;
    },
    [diagram.type],
  );

  const onConnectEnd = useCallback<OnConnectEnd>(
    (_event, state) => {
      if (!state || state.isValid !== false) return;
      const from = state.fromHandle;
      const to = state.toHandle;
      if (!from || !to) return;

      const sourceH = from.type === "source" ? from : to;
      const targetH = from.type === "source" ? to : from;
      const conn: Connection = {
        source: sourceH.nodeId,
        target: targetH.nodeId,
        sourceHandle: sourceH.id ?? null,
        targetHandle: targetH.id ?? null,
      };
      const result = validateConnection(
        diagram.type,
        conn,
        stateRef.current.nodes,
        stateRef.current.edges,
      );
      if (!result.valid) setToast(result.reason);
    },
    [diagram.type],
  );

  const onSelectionChange = useCallback<OnSelectionChangeFunc>(
    ({ nodes: selNodes, edges: selEdges }) => {
      setSelectedNodeId(selNodes[0]?.id ?? null);
      setSelectedEdgeId(selEdges[0]?.id ?? null);
    },
    [],
  );

  const onAddNode = useCallback(
    (nodeType: string, label: string, position: XYPosition) => {
      const size = defaultNodeSize(nodeType);
      const node: Node = {
        id: crypto.randomUUID(),
        type: diagram.type,
        position,
        data: defaultNodeData(nodeType, label),
        width: size.width,
        height: size.height,
      };
      setNodes((ns) => [...ns, node]);
      markDirty();
    },
    [diagram.type, setNodes, markDirty],
  );

  const onUpdateNode = useCallback(
    (id: string, patch: Partial<DiagramNodeData>) => {
      setNodes((ns) =>
        ns.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
        ),
      );
      markDirty();
    },
    [setNodes, markDirty],
  );

  const onUpdateEdge = useCallback(
    (id: string, relationId: string) => {
      const data = buildEdgeData(diagram.type, relationId);
      setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, data } : e)));
      markDirty();
    },
    [diagram.type, setEdges, markDirty],
  );

  useEffect(() => {
    stateRef.current = { nodes, edges, name, dirty };
  }, [nodes, edges, name, dirty]);

  const save = useCallback(async () => {
    const revision = trackerRef.current.begin();
    if (revision === null) return;
    const current = stateRef.current;
    setSaving(true);
    try {
      const res = await fetch(`/api/diagrams/${diagram.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: current.name.trim() || "Sem título",
          data: serialize(current.nodes, current.edges),
        }),
      });
      if (res.ok) setDirty(!trackerRef.current.complete(revision));
      else {
        trackerRef.current.fail();
        setToast("Não foi possível salvar o diagrama.");
      }
    } catch {
      trackerRef.current.fail();
      setToast("Não foi possível salvar o diagrama.");
    } finally {
      setSaving(false);
    }
  }, [diagram.id]);

  const saveRef = useRef(save);
  useEffect(() => { saveRef.current = save; }, [save]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (stateRef.current.dirty) saveRef.current();
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (stateRef.current.dirty) saveRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (stateRef.current.dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const current = stateRef.current;
      const err = await exportDiagramToPdf(current.name, current.nodes, getNodesBounds(current.nodes));
      if (err) setToast(err);
    } catch {
      setToast("Não foi possível exportar o PDF. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }, [getNodesBounds]);

  const handleName = useCallback((value: string) => {
    setName(value);
    markDirty();
  }, [markDirty]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );
  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  );

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-bg">
      <MarkerDefs />
      <Toolbar
        name={name}
        onNameChange={handleName}
        type={diagram.type}
        dirty={dirty}
        saving={saving}
        exporting={exporting}
        onSave={() => saveRef.current()}
        onExport={handleExport}
      />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <Palette diagramType={diagram.type} onAdd={onAddNode} />
        <div className="relative min-h-0 min-w-0 flex-1" data-testid="diagram-canvas">
          <Canvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
            isValidConnection={isValidConnection}
            onSelectionChange={onSelectionChange}
            onAddNode={onAddNode}
          />
          {toast && (
            <div className="glass-strong absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 shadow-[0_0_24px_rgba(239,68,68,0.2)]">
              {toast}
            </div>
          )}
        </div>
        <button type="button" onClick={() => setPropertiesOpen(!propertiesOpen)} aria-expanded={propertiesOpen} className="absolute bottom-3 right-3 z-20 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm lg:hidden">
          {propertiesOpen ? "Fechar propriedades" : "Propriedades"}
        </button>
        <div className={`${propertiesOpen ? "flex" : "hidden"} absolute bottom-14 right-2 top-28 z-20 max-w-[calc(100%-1rem)] overflow-y-auto rounded-lg shadow-xl lg:static lg:flex lg:max-w-none lg:rounded-none lg:shadow-none`}>
        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          diagramName={name}
          diagramType={diagram.type}
          nodeCount={nodes.length}
          edgeCount={edges.length}
          onUpdateNode={onUpdateNode}
          onUpdateEdge={onUpdateEdge}
        />
        </div>
      </div>
    </div>
  );
}

export function Editor({ diagram }: { diagram: EditorDiagram }) {
  return (
    <ReactFlowProvider>
      <EditorInner diagram={diagram} />
    </ReactFlowProvider>
  );
}
