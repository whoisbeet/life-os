"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, ArrowRight, Lock, Mail, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((d) => {
      if (d.authenticated) router.replace("/app");
    }).catch(() => {});
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Authentication failed");
      if (data.requiresVerification) {
        setError("Check your email to verify your account.");
      } else if (data.authenticated) {
        router.replace("/app");
      } else {
        throw new Error("Authentication did not complete. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-96 w-96 animate-pulse rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 animate-pulse rounded-full bg-violet-500/15 blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md rounded-2xl border border-border bg-card/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg"><Brain className="h-7 w-7" /></div>
          <h1 className="text-3xl font-bold tracking-tight">Life OS</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your digital brain, secured.</p>
        </div>
        <div className="mb-6 flex gap-1 rounded-xl bg-muted p-1">
          <button type="button" className={`flex-1 rounded-lg p-2 text-sm font-semibold ${mode === "login" ? "bg-background shadow" : "text-muted-foreground"}`} onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
          <button type="button" className={`flex-1 rounded-lg p-2 text-sm font-semibold ${mode === "register" ? "bg-background shadow" : "text-muted-foreground"}`} onClick={() => { setMode("register"); setError(""); }}>Create account</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && <div><Label className="mb-1.5 block">Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></div>}
          <div><Label className="mb-1.5 block">Email</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" /><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="pl-10" required /></div></div>
          <div><Label className="mb-1.5 block">Password</Label><div className="relative"><Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" /><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} className="pl-10" required /></div></div>
          {error && <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{error}</p>}
          <Button type="submit" className="h-11 w-full gap-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white" disabled={loading}>{loading ? <><Loader2 className="h-4 w-4 animate-spin" />Working…</> : <>{mode === "login" ? "Sign in" : "Create account"}<ArrowRight className="h-4 w-4" /></>}</Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground"><Shield className="mr-1 inline h-3 w-3" />Open-source · Self-hosted · Your data, your brain</p>
      </motion.div>
    </main>
  );
}
