"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type OnConnectEnd,
  type OnSelectionChangeFunc,
  type IsValidConnection,
  type XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NODE_TYPES } from "@/components/nodes";
import { EDGE_TYPES } from "@/components/edges";
import { ConnectionLine } from "@/components/edges/ConnectionLine";
import { useIsDark } from "@/lib/use-dark";

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectEnd: OnConnectEnd;
  isValidConnection: IsValidConnection;
  onSelectionChange: OnSelectionChangeFunc;
  onAddNode: (nodeType: string, label: string, position: XYPosition) => void;
}

export function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectEnd,
  isValidConnection,
  onSelectionChange,
  onAddNode,
}: CanvasProps) {
  const { screenToFlowPosition } = useReactFlow();
  const dark = useIsDark();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/diagram-node");
      if (!raw) return;
      try {
        const item = JSON.parse(raw) as { nodeType: string; label: string };
        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        onAddNode(item.nodeType, item.label, position);
      } catch {
        /* payload inválido */
      }
    },
    [screenToFlowPosition, onAddNode],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      edgeTypes={EDGE_TYPES}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      isValidConnection={isValidConnection}
      onSelectionChange={onSelectionChange}
      connectionLineComponent={ConnectionLine}
      defaultEdgeOptions={{ type: "diagram" }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      colorMode={dark ? "dark" : "light"}
      snapToGrid
      snapGrid={[16, 16]}
      fitView
      minZoom={0.2}
      maxZoom={2}
      connectionRadius={45}
      deleteKeyCode={["Backspace", "Delete"]}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      <Controls />
      <MiniMap pannable zoomable position="top-right" />
    </ReactFlow>
  );
}
