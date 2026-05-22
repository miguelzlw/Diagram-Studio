import type { Connection, Edge, Node } from "@xyflow/react";
import type { ColumnDef, DiagramNodeData } from "@/components/nodes/shared";

export interface ValidationResult {
  valid: boolean;
  reason: string;
}

const OK: ValidationResult = { valid: true, reason: "" };

function fail(reason: string): ValidationResult {
  return { valid: false, reason };
}

/**
 * Valida uma tentativa de conexão de acordo com as regras do tipo de diagrama.
 */
export function validateConnection(
  diagramType: string,
  connection: Connection,
  nodes: Node[],
  edges: Edge[],
): ValidationResult {
  const source = nodes.find((n) => n.id === connection.source);
  const target = nodes.find((n) => n.id === connection.target);
  if (!source || !target) return fail("Conexão inválida.");
  if (source.id === target.id) {
    return fail("Um elemento não pode conectar a si mesmo.");
  }

  const sd = source.data as DiagramNodeData;
  const td = target.data as DiagramNodeData;

  switch (diagramType) {
    case "flowchart":
      return validateFlowchart(sd, td, source.id, target.id, edges);
    case "uml-usecase":
      return validateUseCase(sd, td);
    case "database":
      return validateDatabase(connection, sd, td);
    default:
      return OK;
  }
}

function validateFlowchart(
  sd: DiagramNodeData,
  td: DiagramNodeData,
  sourceId: string,
  targetId: string,
  edges: Edge[],
): ValidationResult {
  if (sd.nodeType === "end") {
    return fail("O nó Fim não pode ter saídas.");
  }
  if (td.nodeType === "start") {
    return fail("O nó Início não pode receber entradas.");
  }

  const outgoing = edges.filter((e) => e.source === sourceId).length;
  if (sd.nodeType === "decision" && outgoing >= 2) {
    return fail("Uma Decisão tem no máximo duas saídas (sim e não).");
  }
  if (sd.nodeType === "process" && outgoing >= 1) {
    return fail("Um Processo tem apenas uma saída.");
  }

  const incoming = edges.filter((e) => e.target === targetId).length;
  if (td.nodeType === "process" && incoming >= 1) {
    return fail("Um Processo recebe apenas uma entrada.");
  }
  return OK;
}

function validateUseCase(
  sd: DiagramNodeData,
  td: DiagramNodeData,
): ValidationResult {
  if (sd.nodeType === "actor" && td.nodeType === "actor") {
    return fail("Um ator não conecta diretamente com outro ator.");
  }
  if (sd.nodeType === "system" || td.nodeType === "system") {
    return fail("O Sistema agrupa casos de uso; não recebe conexões.");
  }
  return OK;
}

function validateDatabase(
  connection: Connection,
  sd: DiagramNodeData,
  td: DiagramNodeData,
): ValidationResult {
  const sourceColumns: ColumnDef[] = sd.columns ?? [];
  const targetColumns: ColumnDef[] = td.columns ?? [];

  const sourceCol = sourceColumns.find(
    (c) => `${c.id}-s` === connection.sourceHandle,
  );
  const targetCol = targetColumns.find(
    (c) => `${c.id}-t` === connection.targetHandle,
  );

  if (!sourceCol) {
    return fail("A relação deve sair de uma coluna da tabela.");
  }
  if (sourceCol.key !== "PK") {
    return fail("A relação deve sair de uma coluna PK (chave primária).");
  }
  if (!targetCol) {
    return fail("Conecte até uma coluna da tabela de destino.");
  }
  return OK;
}
