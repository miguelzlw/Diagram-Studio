import { getDiagramType } from "@/lib/diagram-types";

export function TypeBadge({ type }: { type: string }) {
  const config = getDiagramType(type);
  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
        {type}
      </span>
    );
  }

  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${config.badge}`}
    >
      <Icon size={12} stroke={2} />
      {config.label}
    </span>
  );
}
