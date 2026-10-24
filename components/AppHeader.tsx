import Link from "next/link";
import { IconAffiliate } from "@tabler/icons-react";
import { auth, signOut } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function AppHeader() {
  const session = await auth();
  const name = session?.user?.name ?? "?";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface-glass backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-soft text-electric ring-1 ring-electric/30">
            <IconAffiliate size={18} stroke={2} />
          </span>
          <span className="text-base font-bold tracking-tight text-on-surface">
            Diagram <span className="text-electric">Studio</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div
            title={name}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-xs font-bold text-on-surface"
          >
            {initial}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm font-medium text-on-surface-variant transition-colors hover:text-electric"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
