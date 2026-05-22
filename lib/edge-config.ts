/**
 * Configuração das arestas (relacionamentos) de cada tipo de diagrama.
 * `markerStart` / `markerEnd` referenciam ids definidos em <MarkerDefs />.
 */

export interface EdgeOption {
  /** Id do relacionamento (gravado em edge.data.relation). */
  id: string;
  /** Rótulo exibido no seletor do painel de propriedades. */
  label: string;
  /** Texto desenhado sobre a aresta. */
  edgeLabel?: string;
  dashed?: boolean;
  markerStart?: string;
  markerEnd?: string;
}

export interface DiagramEdgeData {
  relation: string;
  label?: string;
  dashed?: boolean;
  markerStart?: string;
  markerEnd?: string;
  [key: string]: unknown;
}

const ARROW = "arrow";

export const EDGE_OPTIONS: Record<string, EdgeOption[]> = {
  architecture: [
    { id: "http", label: "HTTP", edgeLabel: "HTTP", markerEnd: ARROW },
    { id: "tcp", label: "TCP", edgeLabel: "TCP", markerEnd: ARROW },
    { id: "reads", label: "lê", edgeLabel: "lê", markerEnd: ARROW },
    {
      id: "publishes",
      label: "publica em",
      edgeLabel: "publica em",
      markerEnd: ARROW,
    },
    { id: "consumes", label: "consome", edgeLabel: "consome", markerEnd: ARROW },
  ],
  flowchart: [
    { id: "flow", label: "Fluxo", markerEnd: ARROW },
    { id: "yes", label: "Saída sim", edgeLabel: "sim", markerEnd: ARROW },
    { id: "no", label: "Saída não", edgeLabel: "não", markerEnd: ARROW },
  ],
  "uml-class": [
    { id: "inheritance", label: "Herança", markerEnd: "triangle-empty" },
    {
      id: "implementation",
      label: "Implementação",
      markerEnd: "triangle-empty",
      dashed: true,
    },
    { id: "association", label: "Associação", markerEnd: ARROW },
    { id: "aggregation", label: "Agregação", markerStart: "diamond-empty" },
    { id: "composition", label: "Composição", markerStart: "diamond-filled" },
    {
      id: "dependency",
      label: "Dependência",
      markerEnd: ARROW,
      dashed: true,
    },
  ],
  "uml-usecase": [
    { id: "association", label: "Associação" },
    {
      id: "include",
      label: "«include»",
      edgeLabel: "«include»",
      dashed: true,
      markerEnd: ARROW,
    },
    {
      id: "extend",
      label: "«extend»",
      edgeLabel: "«extend»",
      dashed: true,
      markerEnd: ARROW,
    },
  ],
  database: [
    { id: "1:1", label: "1:1", markerStart: "cf-one", markerEnd: "cf-one" },
    { id: "1:N", label: "1:N", markerStart: "cf-one", markerEnd: "cf-many" },
    { id: "N:N", label: "N:N", markerStart: "cf-many", markerEnd: "cf-many" },
  ],
  cloud: [{ id: "link", label: "Conexão", markerEnd: ARROW }],
  mindmap: [{ id: "branch", label: "Ramificação" }],
};

export const DEFAULT_RELATION: Record<string, string> = {
  architecture: "http",
  flowchart: "flow",
  "uml-class": "association",
  "uml-usecase": "association",
  database: "1:N",
  cloud: "link",
  mindmap: "branch",
};

export function getEdgeOptions(diagramType: string): EdgeOption[] {
  return EDGE_OPTIONS[diagramType] ?? [];
}

export function getEdgeOption(
  diagramType: string,
  relationId: string,
): EdgeOption | undefined {
  return EDGE_OPTIONS[diagramType]?.find((o) => o.id === relationId);
}

export function buildEdgeData(
  diagramType: string,
  relationId: string,
): DiagramEdgeData {
  const opt = getEdgeOption(diagramType, relationId);
  if (!opt) return { relation: relationId };
  return {
    relation: opt.id,
    label: opt.edgeLabel,
    dashed: opt.dashed,
    markerStart: opt.markerStart,
    markerEnd: opt.markerEnd,
  };
}
