"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import {
  IconServer,
  IconDatabase,
  IconPlugConnected,
  IconBolt,
  IconStack2,
  IconWorld,
  IconUser,
  IconBox,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import {
  NodeHandles,
  Resizer,
  selectionRing,
  type DiagramNodeData,
} from "./shared";

const ICONS: Record<string, Icon> = {
  server: IconServer,
  database: IconDatabase,
  api: IconPlugConnected,
  cache: IconBolt,
  queue: IconStack2,
  external: IconWorld,
  user: IconUser,
};

function ArchitectureNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const Icon = ICONS[d.nodeType] ?? IconBox;

  return (
    <div
      className={`inner-glow flex h-full w-full items-center gap-2 overflow-hidden rounded-lg border border-outline-variant bg-surface-container px-3 py-2 shadow-sm transition-all hover:border-electric/50 ${selectionRing(
        !!selected,
      )}`}
    >
      <Resizer selected={selected} minWidth={120} minHeight={48} />
      <NodeHandles />
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-electric/30 bg-electric/10 text-electric">
        <Icon size={18} stroke={1.8} />
      </span>
      <span className="truncate text-sm font-semibold text-on-surface">
        {d.label}
      </span>
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeImpl);
