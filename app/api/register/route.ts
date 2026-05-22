import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "O usuário precisa ter ao menos 3 caracteres.")
    .max(32, "O usuário pode ter no máximo 32 caracteres."),
  password: z
    .string()
    .min(6, "A senha precisa ter ao menos 6 caracteres."),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const { username, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json(
      { error: "Esse nome de usuário já está em uso." },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, password: hashed } });

  return NextResponse.json({ ok: true }, { status: 201 });
}
