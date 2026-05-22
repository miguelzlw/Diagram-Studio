import { notFound } from "next/navigation";
import type { Node, Edge } from "@xyflow/react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { defaultNodeSize } from "@/lib/node-factory";
import { Editor, type EditorDiagram } from "@/components/editor/Editor";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const diagram = await prisma.diagram.findUnique({ where: { id } });
  if (!diagram || diagram.userId !== session!.user.id) {
    notFound();
  }

  let nodes: Node[] = [];
  let edges: Edge[] = [];
  try {
    const parsed = JSON.parse(diagram.data);
    if (Array.isArray(parsed?.nodes)) nodes = parsed.nodes as Node[];
    if (Array.isArray(parsed?.edges)) edges = parsed.edges as Edge[];
  } catch {
    /* dados corrompidos — começa vazio */
  }

  // Garante que todo nó tenha dimensões (necessário para redimensionar).
  nodes = nodes.map((n) => {
    if (n.width && n.height) return n;
    const size = defaultNodeSize(
      (n.data as { nodeType?: string } | undefined)?.nodeType ?? "",
    );
    return {
      ...n,
      width: n.width ?? size.width,
      height: n.height ?? size.height,
    };
  });

  const editorDiagram: EditorDiagram = {
    id: diagram.id,
    name: diagram.name,
    type: diagram.type,
    nodes,
    edges,
  };

  return <Editor diagram={editorDiagram} />;
}
