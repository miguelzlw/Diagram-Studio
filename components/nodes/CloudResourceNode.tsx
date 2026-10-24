"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import {
  IconServer2,
  IconBucket,
  IconDatabase,
  IconFunction,
  IconRouter,
  IconWorldWww,
  IconApps,
  IconCloudComputing,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import {
  NodeHandles,
  Resizer,
  selectionRing,
  type DiagramNodeData,
} from "./shared";

const RESOURCE_ICONS: Record<string, Icon> = {
  ec2: IconServer2,
  s3: IconBucket,
  rds: IconDatabase,
  lambda: IconFunction,
  apigateway: IconRouter,
  cloudfront: IconWorldWww,
  appservice: IconApps,
  cosmosdb: IconDatabase,
  functions: IconFunction,
  storage: IconBucket,
};

const CONTAINERS: Record<string, string> = {
  region: "border-outline",
  vpc: "border-orange-500/60",
  "subnet-public": "border-emerald-500/60",
  "subnet-private": "border-cyan-500/60",
};

function CloudResourceNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const ring = selectionRing(!!selected);
  const containerStyle = CONTAINERS[d.nodeType];

  if (containerStyle) {
    return (
      <div
        className={`inner-glow h-full w-full rounded-lg border-2 border-dashed bg-surface-container/30 backdrop-blur-sm ${containerStyle} ${ring}`}
      >
        <Resizer selected={selected} minWidth={180} minHeight={130} />
        <NodeHandles />
        <div className="truncate px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {d.label}
        </div>
      </div>
    );
  }

  const Icon = RESOURCE_ICONS[d.nodeType] ?? IconCloudComputing;

  return (
    <div
      className={`inner-glow flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border border-outline-variant bg-surface-container p-2 shadow-sm transition-all hover:border-orange-500/40 ${ring}`}
    >
      <Resizer selected={selected} minWidth={96} minHeight={92} />
      <NodeHandles />
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-orange-500/30 bg-orange-500/10 text-orange-400">
        <Icon size={20} stroke={1.7} />
      </span>
      <span className="truncate text-center text-[11px] font-semibold text-on-surface">
        {d.label}
      </span>
    </div>
  );
}

export const CloudResourceNode = memo(CloudResourceNodeImpl);
