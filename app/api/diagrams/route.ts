import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIAGRAM_TYPE_IDS } from "@/lib/diagram-types";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const diagrams = await prisma.diagram.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(diagrams);
}

const createSchema = z.object({
  type: z.enum(DIAGRAM_TYPE_IDS as [string, ...string[]]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Tipo de diagrama inválido." },
      { status: 400 },
    );
  }

  const diagram = await prisma.diagram.create({
    data: {
      name: "Sem título",
      type: parsed.data.type,
      data: JSON.stringify({ nodes: [], edges: [] }),
      userId: session.user.id,
    },
  });

  return NextResponse.json(diagram, { status: 201 });
}
