"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlowProvider,
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
  const [nodes, setNodes, onNodesChange] = useNodesState(diagram.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(diagram.edges);
  const [name, setName] = useState(diagram.name);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      if (changes.some((c) => c.type !== "select" && c.type !== "dimensions")) {
        setDirty(true);
      }
    },
    [onNodesChange],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      if (changes.some((c) => c.type !== "select")) setDirty(true);
    },
    [onEdgesChange],
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
      setDirty(true);
    },
    [diagram.type, setEdges, setNodes],
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
      setDirty(true);
    },
    [diagram.type, setNodes],
  );

  const onUpdateNode = useCallback(
    (id: string, patch: Partial<DiagramNodeData>) => {
      setNodes((ns) =>
        ns.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
        ),
      );
      setDirty(true);
    },
    [setNodes],
  );

  const onUpdateEdge = useCallback(
    (id: string, relationId: string) => {
      const data = buildEdgeData(diagram.type, relationId);
      setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, data } : e)));
      setDirty(true);
    },
    [diagram.type, setEdges],
  );

  const stateRef = useRef({ nodes, edges, name, dirty });
  stateRef.current = { nodes, edges, name, dirty };

  const save = useCallback(async () => {
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
      if (res.ok) setDirty(false);
      else setToast("Não foi possível salvar o diagrama.");
    } catch {
      setToast("Não foi possível salvar o diagrama.");
    } finally {
      setSaving(false);
    }
  }, [diagram.id]);

  const saveRef = useRef(save);
  saveRef.current = save;

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
    const err = await exportDiagramToPdf(
      stateRef.current.name,
      stateRef.current.nodes,
    );
    if (err) setToast(err);
    setExporting(false);
  }, []);

  const handleName = useCallback((value: string) => {
    setName(value);
    setDirty(true);
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );
  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  );

  return (
    <div className="flex h-screen flex-col">
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
      <div className="flex flex-1 overflow-hidden">
        <Palette diagramType={diagram.type} />
        <div className="relative flex-1">
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
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-slate-700">
              {toast}
            </div>
          )}
        </div>
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
  );
}

export function Editor({ diagram }: { diagram: EditorDiagram }) {
  return (
    <ReactFlowProvider>
      <EditorInner diagram={diagram} />
    </ReactFlowProvider>
  );
}
