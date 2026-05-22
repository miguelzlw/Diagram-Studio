import type { DiagramNodeData } from "@/components/nodes/shared";

export function defaultNodeData(
  nodeType: string,
  label: string,
): DiagramNodeData {
  if (nodeType === "class" || nodeType === "interface") {
    return { nodeType, label, attributes: [], methods: [] };
  }
  if (nodeType === "table") {
    return { nodeType, label, columns: [] };
  }
  return { nodeType, label };
}

export interface NodeSize {
  width: number;
  height: number;
}

const NODE_SIZES: Record<string, NodeSize> = {
  // Containers
  system: { width: 360, height: 240 },
  region: { width: 360, height: 240 },
  vpc: { width: 320, height: 220 },
  "subnet-public": { width: 240, height: 170 },
  "subnet-private": { width: 240, height: 170 },
  // Fluxograma
  start: { width: 150, height: 60 },
  end: { width: 150, height: 60 },
  process: { width: 168, height: 60 },
  io: { width: 168, height: 60 },
  decision: { width: 140, height: 140 },
  // UML Classes
  class: { width: 200, height: 150 },
  interface: { width: 200, height: 150 },
  // UML Caso de uso
  actor: { width: 96, height: 100 },
  usecase: { width: 176, height: 80 },
  // Banco de dados
  table: { width: 240, height: 150 },
  // Mapa mental
  central: { width: 190, height: 72 },
  subtopic: { width: 150, height: 56 },
};

const CLOUD_RESOURCE_SIZE: NodeSize = { width: 124, height: 110 };
const ARCHITECTURE_SIZE: NodeSize = { width: 176, height: 60 };

const CLOUD_RESOURCE_TYPES = new Set([
  "ec2",
  "s3",
  "rds",
  "lambda",
  "apigateway",
  "cloudfront",
  "appservice",
  "cosmosdb",
  "functions",
  "storage",
]);

export function defaultNodeSize(nodeType: string): NodeSize {
  if (NODE_SIZES[nodeType]) return NODE_SIZES[nodeType];
  if (CLOUD_RESOURCE_TYPES.has(nodeType)) return CLOUD_RESOURCE_SIZE;
  return ARCHITECTURE_SIZE;
}
