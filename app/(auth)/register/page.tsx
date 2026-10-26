"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { IconAffiliate } from "@tabler/icons-react";

const INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-electric focus:ring-2 focus:ring-electric/20 placeholder:text-on-surface-muted";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Não foi possível criar a conta.");

        return;
      }

      const signInRes = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Conta criada, mas o login falhou. Tente entrar manualmente.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível conectar. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ambient-mesh flex min-h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-soft text-electric ring-1 ring-electric/30">
            <IconAffiliate size={24} stroke={2} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Criar conta
          </h1>
          <p className="mt-1.5 text-sm text-on-surface-variant">
            Escolha um usuário e uma senha
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass inner-glow rounded-2xl p-6 shadow-2xl"
        >
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Usuário
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              minLength={3}
              maxLength={32}
              className={INPUT_CLASS}
            />
          </label>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
              className={INPUT_CLASS}
            />
          </label>

          {error && (
            <p className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-electric mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-on-surface-variant">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-electric transition-colors hover:text-primary"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
