import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

async function loadOwned(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  }
  const diagram = await prisma.diagram.findUnique({ where: { id } });
  if (!diagram || diagram.userId !== session.user.id) {
    return { error: NextResponse.json({ error: "Diagrama não encontrado." }, { status: 404 }) };
  }
  return { diagram };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { error, diagram } = await loadOwned(id);
  if (error) return error;
  return NextResponse.json(diagram);
}

const updateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    data: z.string().optional(),
  })
  .refine((v) => v.name !== undefined || v.data !== undefined, {
    message: "Nada para atualizar.",
  });

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { error } = await loadOwned(id);
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const updated = await prisma.diagram.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const { error } = await loadOwned(id);
  if (error) return error;

  await prisma.diagram.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
