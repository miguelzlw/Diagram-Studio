import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { DashboardGrid } from "@/components/DashboardGrid";

export default async function DashboardPage() {
  const session = await auth();

  // Optimization (⚡ Bolt): Project only the fields needed by DashboardGrid.
  // Omitting the heavy `data` column (diagram JSON containing nodes/edges)
  // avoids querying Postgres TOAST tables, drastically reduces network payload
  // from the database, and saves server memory and serialization overhead.
  const diagrams = await prisma.diagram.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      type: true,
      updatedAt: true,
    },
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
      <main className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <DashboardGrid diagrams={items} />
      </main>
    </>
  );
}
