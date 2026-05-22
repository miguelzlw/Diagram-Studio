"use client";

const STROKE = "#94a3b8";

/**
 * Definições SVG dos marcadores de ponta das arestas.
 * Renderizado uma vez; referenciado por `url(#dg-<id>)`.
 */
export function MarkerDefs() {
  return (
    <svg
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        {/* Seta simples preenchida */}
        <marker
          id="dg-arrow"
          viewBox="0 0 12 12"
          markerWidth="11"
          markerHeight="11"
          refX="9"
          refY="6"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M1,1 L10,6 L1,11 Z" fill={STROKE} />
        </marker>

        {/* Triângulo vazio — herança / implementação */}
        <marker
          id="dg-triangle-empty"
          viewBox="0 0 16 16"
          markerWidth="16"
          markerHeight="16"
          refX="14"
          refY="8"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M1,1 L15,8 L1,15 Z"
            className="fill-white dark:fill-slate-900"
            stroke={STROKE}
            strokeWidth="1.5"
          />
        </marker>

        {/* Losango vazio — agregação */}
        <marker
          id="dg-diamond-empty"
          viewBox="0 0 24 14"
          markerWidth="24"
          markerHeight="14"
          refX="22"
          refY="7"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M1,7 L11,1.5 L22,7 L11,12.5 Z"
            className="fill-white dark:fill-slate-900"
            stroke={STROKE}
            strokeWidth="1.5"
          />
        </marker>

        {/* Losango cheio — composição */}
        <marker
          id="dg-diamond-filled"
          viewBox="0 0 24 14"
          markerWidth="24"
          markerHeight="14"
          refX="22"
          refY="7"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M1,7 L11,1.5 L22,7 L11,12.5 Z" fill={STROKE} />
        </marker>

        {/* Crow's foot — "um" */}
        <marker
          id="dg-cf-one"
          viewBox="0 0 16 16"
          markerWidth="16"
          markerHeight="16"
          refX="11"
          refY="8"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M8,2 L8,14" stroke={STROKE} strokeWidth="1.6" fill="none" />
        </marker>

        {/* Crow's foot — "muitos" */}
        <marker
          id="dg-cf-many"
          viewBox="0 0 18 16"
          markerWidth="18"
          markerHeight="16"
          refX="15"
          refY="8"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M15,8 L3,2 M15,8 L3,8 M15,8 L3,14"
            stroke={STROKE}
            strokeWidth="1.6"
            fill="none"
          />
        </marker>
      </defs>
    </svg>
  );
}
