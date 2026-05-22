import type { NodeTypes } from "@xyflow/react";
import { ArchitectureNode } from "./ArchitectureNode";
import { FlowchartNode } from "./FlowchartNode";
import { UmlClassNode } from "./UmlClassNode";
import { UmlUseCaseNode } from "./UmlUseCaseNode";
import { DatabaseTableNode } from "./DatabaseTableNode";
import { CloudResourceNode } from "./CloudResourceNode";
import { MindMapNode } from "./MindMapNode";

/**
 * Mapeia o id do tipo de diagrama ao componente de nó.
 * Todo nó de um diagrama usa `type` = id do tipo de diagrama,
 * e distingue o subtipo por `data.nodeType`.
 */
export const NODE_TYPES: NodeTypes = {
  architecture: ArchitectureNode,
  flowchart: FlowchartNode,
  "uml-class": UmlClassNode,
  "uml-usecase": UmlUseCaseNode,
  database: DatabaseTableNode,
  cloud: CloudResourceNode,
  mindmap: MindMapNode,
};
