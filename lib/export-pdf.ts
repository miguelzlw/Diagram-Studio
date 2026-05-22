import { getNodesBounds, getViewportForBounds, type Node } from "@xyflow/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const CAPTURE_W = 1600;
const CAPTURE_H = 1000;

/**
 * Captura o canvas do React Flow e gera um PDF A4 paisagem.
 * Retorna uma mensagem de erro, ou null em caso de sucesso.
 */
export async function exportDiagramToPdf(
  name: string,
  nodes: Node[],
): Promise<string | null> {
  if (nodes.length === 0) {
    return "Adicione elementos ao diagrama antes de exportar.";
  }

  const viewport = document.querySelector(
    ".react-flow__viewport",
  ) as HTMLElement | null;
  if (!viewport) {
    return "Não foi possível localizar o canvas.";
  }

  const bounds = getNodesBounds(nodes);
  const transform = getViewportForBounds(
    bounds,
    CAPTURE_W,
    CAPTURE_H,
    0.2,
    2,
    0.12,
  );

  // Exporta sempre no tema claro: o PDF tem fundo branco, então
  // elementos com texto/ícone claros (atores, etc.) ficariam invisíveis.
  const html = document.documentElement;
  const wasDark = html.classList.contains("dark");
  if (wasDark) html.classList.remove("dark");

  let dataUrl: string;
  try {
    dataUrl = await toPng(viewport, {
      backgroundColor: "#ffffff",
      width: CAPTURE_W,
      height: CAPTURE_H,
      pixelRatio: 2,
      style: {
        width: `${CAPTURE_W}px`,
        height: `${CAPTURE_H}px`,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    });
  } finally {
    if (wasDark) html.classList.add("dark");
  }

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const footerH = 10;

  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2 - footerH;
  const ratio = CAPTURE_W / CAPTURE_H;

  let imgW = maxW;
  let imgH = imgW / ratio;
  if (imgH > maxH) {
    imgH = maxH;
    imgW = imgH * ratio;
  }
  const x = (pageW - imgW) / 2;

  pdf.addImage(dataUrl, "PNG", x, margin, imgW, imgH);

  pdf.setFontSize(9);
  pdf.setTextColor(120);
  const date = new Date().toLocaleDateString("pt-BR");
  pdf.text(`${name}  —  ${date}`, margin, pageH - 6);

  pdf.save(`${name.trim() || "diagrama"}.pdf`);
  return null;
}
