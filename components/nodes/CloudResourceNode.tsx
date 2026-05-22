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
  region: "border-slate-400 dark:border-slate-500",
  vpc: "border-orange-400 dark:border-orange-500/60",
  "subnet-public": "border-emerald-400 dark:border-emerald-500/60",
  "subnet-private": "border-sky-400 dark:border-sky-500/60",
};

function CloudResourceNodeImpl({ data, selected }: NodeProps) {
  const d = data as DiagramNodeData;
  const ring = selectionRing(!!selected);
  const containerStyle = CONTAINERS[d.nodeType];

  if (containerStyle) {
    return (
      <div
        className={`h-full w-full rounded-lg border-2 border-dashed bg-white/40 dark:bg-slate-800/30 ${containerStyle} ${ring}`}
      >
        <Resizer selected={selected} minWidth={180} minHeight={130} />
        <NodeHandles />
        <div className="truncate px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {d.label}
        </div>
      </div>
    );
  }

  const Icon = RESOURCE_ICONS[d.nodeType] ?? IconCloudComputing;

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border border-orange-300 bg-white p-2 shadow-sm dark:border-orange-500/50 dark:bg-slate-800 ${ring}`}
    >
      <Resizer selected={selected} minWidth={96} minHeight={92} />
      <NodeHandles />
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
        <Icon size={20} stroke={1.7} />
      </span>
      <span className="truncate text-center text-[11px] font-medium text-slate-700 dark:text-slate-200">
        {d.label}
      </span>
    </div>
  );
}

export const CloudResourceNode = memo(CloudResourceNodeImpl);
