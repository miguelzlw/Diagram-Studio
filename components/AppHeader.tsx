import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function AppHeader() {
  const session = await auth();
  const name = session?.user?.name ?? "?";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100"
        >
          Diagram Studio
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div
            title={name}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white"
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
              className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
