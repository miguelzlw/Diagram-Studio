import { getDiagramType } from "@/lib/diagram-types";

export function TypeBadge({ type }: { type: string }) {
  const config = getDiagramType(type);
  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
        {type}
      </span>
    );
  }

  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}
    >
      <Icon size={13} stroke={2} />
      {config.label}
    </span>
  );
}
