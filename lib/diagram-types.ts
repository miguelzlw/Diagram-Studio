import type { Icon } from "@tabler/icons-react";
import {
  IconServer,
  IconSitemap,
  IconBox,
  IconUser,
  IconDatabase,
  IconCloud,
  IconBulb,
} from "@tabler/icons-react";

export type DiagramTypeId =
  | "architecture"
  | "flowchart"
  | "uml-class"
  | "uml-usecase"
  | "database"
  | "cloud"
  | "mindmap";

export interface PaletteItem {
  nodeType: string;
  label: string;
}

export interface DiagramTypeConfig {
  id: DiagramTypeId;
  label: string;
  icon: Icon;
  /** Quando usar este tipo de diagrama. */
  description: string;
  /** Regra principal de conexão entre os elementos. */
  connectionRule: string;
  /** Classes do badge colorido (claro + escuro). */
  badge: string;
  /** Classes do contêiner do ícone (claro + escuro). */
  iconWrap: string;
  /** Classe do anel quando o card está selecionado. */
  ring: string;
  /** Elementos disponíveis na paleta do editor. */
  paletteItems: PaletteItem[];
}

export const DIAGRAM_TYPES: Record<DiagramTypeId, DiagramTypeConfig> = {
  architecture: {
    id: "architecture",
    label: "Arquitetura",
    icon: IconServer,
    description:
      "Mapeie servidores, serviços e a infraestrutura do seu sistema.",
    connectionRule:
      "Conexões livres; cada ligação tem um tipo (HTTP, TCP, lê, publica, consome).",
    badge:
      "bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300",
    iconWrap:
      "bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300",
    ring: "ring-blue-500",
    paletteItems: [
      { nodeType: "server", label: "Servidor" },
      { nodeType: "database", label: "Banco" },
      { nodeType: "api", label: "API" },
      { nodeType: "cache", label: "Cache" },
      { nodeType: "queue", label: "Fila" },
      { nodeType: "external", label: "Serviço externo" },
      { nodeType: "user", label: "Usuário" },
    ],
  },
  flowchart: {
    id: "flowchart",
    label: "Fluxograma",
    icon: IconSitemap,
    description: "Represente processos e decisões passo a passo.",
    connectionRule:
      "Decisão tem 2 saídas (sim/não); Início só envia, Fim só recebe.",
    badge:
      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
    iconWrap:
      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
    ring: "ring-emerald-500",
    paletteItems: [
      { nodeType: "start", label: "Início" },
      { nodeType: "end", label: "Fim" },
      { nodeType: "process", label: "Processo" },
      { nodeType: "decision", label: "Decisão" },
      { nodeType: "io", label: "Entrada / Saída" },
    ],
  },
  "uml-class": {
    id: "uml-class",
    label: "UML Classes",
    icon: IconBox,
    description: "Modele classes, interfaces e seus relacionamentos.",
    connectionRule: "Só conecta classe↔classe ou classe↔interface.",
    badge:
      "bg-purple-500/10 text-purple-600 border border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300",
    iconWrap:
      "bg-purple-500/10 text-purple-600 border border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300",
    ring: "ring-purple-500",
    paletteItems: [
      { nodeType: "class", label: "Classe" },
      { nodeType: "interface", label: "Interface" },
    ],
  },
  "uml-usecase": {
    id: "uml-usecase",
    label: "UML Caso de Uso",
    icon: IconUser,
    description: "Descreva atores e as funcionalidades que eles usam.",
    connectionRule: "Ator liga a casos de uso; ator não conecta com ator.",
    badge:
      "bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
    iconWrap:
      "bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
    ring: "ring-amber-500",
    paletteItems: [
      { nodeType: "actor", label: "Ator" },
      { nodeType: "usecase", label: "Caso de uso" },
      { nodeType: "system", label: "Sistema" },
    ],
  },
  database: {
    id: "database",
    label: "Banco de Dados",
    icon: IconDatabase,
    description: "Projete tabelas, colunas e chaves do seu banco.",
    connectionRule: "FK de uma coluna liga à PK da tabela referenciada.",
    badge:
      "bg-cyan-500/10 text-cyan-600 border border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-300",
    iconWrap:
      "bg-cyan-500/10 text-cyan-600 border border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-300",
    ring: "ring-cyan-500",
    paletteItems: [{ nodeType: "table", label: "Tabela" }],
  },
  cloud: {
    id: "cloud",
    label: "Nuvem",
    icon: IconCloud,
    description: "Desenhe arquiteturas em nuvem AWS ou Azure.",
    connectionRule:
      "Recursos ficam dentro do container certo (Subnet ⊂ VPC ⊂ Region).",
    badge:
      "bg-orange-500/10 text-orange-600 border border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300",
    iconWrap:
      "bg-orange-500/10 text-orange-600 border border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300",
    ring: "ring-orange-500",
    paletteItems: [
      { nodeType: "region", label: "Region" },
      { nodeType: "vpc", label: "VPC" },
      { nodeType: "subnet-public", label: "Subnet pública" },
      { nodeType: "subnet-private", label: "Subnet privada" },
      { nodeType: "ec2", label: "EC2" },
      { nodeType: "s3", label: "S3" },
      { nodeType: "rds", label: "RDS" },
      { nodeType: "lambda", label: "Lambda" },
      { nodeType: "apigateway", label: "API Gateway" },
      { nodeType: "cloudfront", label: "CloudFront" },
      { nodeType: "appservice", label: "App Service" },
      { nodeType: "cosmosdb", label: "Cosmos DB" },
      { nodeType: "functions", label: "Functions" },
      { nodeType: "storage", label: "Storage" },
    ],
  },
  mindmap: {
    id: "mindmap",
    label: "Mapa Mental",
    icon: IconBulb,
    description: "Organize ideias livremente a partir de um tópico central.",
    connectionRule: "Ramificações livres, sem restrições.",
    badge:
      "bg-pink-500/10 text-pink-600 border border-pink-500/30 dark:bg-pink-500/15 dark:text-pink-300",
    iconWrap:
      "bg-pink-500/10 text-pink-600 border border-pink-500/30 dark:bg-pink-500/15 dark:text-pink-300",
    ring: "ring-pink-500",
    paletteItems: [
      { nodeType: "central", label: "Tópico central" },
      { nodeType: "subtopic", label: "Sub-tópico" },
    ],
  },
};

export const DIAGRAM_TYPE_LIST: DiagramTypeConfig[] =
  Object.values(DIAGRAM_TYPES);

export const DIAGRAM_TYPE_IDS = Object.keys(DIAGRAM_TYPES) as DiagramTypeId[];

export function getDiagramType(id: string): DiagramTypeConfig | undefined {
  return DIAGRAM_TYPES[id as DiagramTypeId];
}
