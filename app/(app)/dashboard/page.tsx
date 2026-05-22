import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { DashboardGrid } from "@/components/DashboardGrid";

export default async function DashboardPage() {
  const session = await auth();

  const diagrams = await prisma.diagram.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const items = diagrams.map((d) => ({
    id: d.id,
    name: d.name,
    type: d.type,
    updatedAt: d.updatedAt.toISOString(),
  }));

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <DashboardGrid diagrams={items} />
      </main>
    </>
  );
}
