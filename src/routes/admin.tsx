import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initializeAdminAccount } from "@/lib/admin-auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Leaf, ShieldCheck, UserCheck, KeyRound, ArrowRight } from "lucide-react";

const title = "Logivra Team Admin Portal";
const description =
  "Sign in to the Logivra compliance command center to manage permits, demo requests, and team access.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const TEAM_ADMINS = [
  {
    name: "Shrawan",
    username: "shrawan",
    email: "shaan.09042@gmail.com",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Shivank",
    username: "shivank",
    email: "shivnakrao7@gmail.com",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Team Admin 3",
    username: "admin3",
    email: "team-admin3@logivra.com",
    role: "Admin",
    status: "Reserved",
  },
];

function AdminPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/demo-requests" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/demo-requests" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  function resolveEmail(input: string): string {
    const clean = input.trim().toLowerCase();
    const admin = TEAM_ADMINS.find(
      (a) => a.username.toLowerCase() === clean || a.email.toLowerCase() === clean
    );
    return admin ? admin.email : input.trim();
  }

  async function confirmViaRpc(email: string) {
    const { data, error } = await supabase.rpc("confirm_whitelisted_admin", {
      p_email: email,
    });
    if (error) {
      console.warn("[admin] confirm RPC unavailable:", error.message);
      return false;
    }
    return Boolean(data);
  }

  async function signInAndGo(email: string, pwd: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) throw error;
    toast.success("Welcome back!");
    navigate({ to: "/demo-requests" });
  }

  async function handleInitialize(emailToUse: string) {
    // Preferred: server confirms email + sets password (no mail needed)
    try {
      await initializeAdminAccount({ data: { email: emailToUse, password } });
      await signInAndGo(emailToUse, password);
      return;
    } catch (serverErr) {
      console.warn("[admin] Server initialize failed:", serverErr);
    }

    // Try confirming via DB function (after SQL migration is applied)
    await confirmViaRpc(emailToUse);

    // Ensure account exists / password is set via client signup
    const { data, error } = await supabase.auth.signUp({
      email: emailToUse,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/demo-requests`,
        data: { username: identifier.trim() },
      },
    });
    if (error && !error.message.toLowerCase().includes("already")) throw error;

    await confirmViaRpc(emailToUse);

    if (data?.session) {
      toast.success("Admin account ready!");
      navigate({ to: "/demo-requests" });
      return;
    }

    try {
      await signInAndGo(emailToUse, password);
    } catch (signErr) {
      const msg = signErr instanceof Error ? signErr.message.toLowerCase() : "";
      if (msg.includes("email not confirmed") || msg.includes("invalid login")) {
        throw new Error(
          "Email confirmation is required and mail is not arriving. Fix (30 seconds): Lovable → Cloud → Users → Auth settings → Email → turn ON “Auto-confirm email”. Or in Users, open your account and mark email as confirmed. Then sign in again — no email needed."
        );
      }
      throw signErr;
    }
  }

  async function handleSignIn(emailToUse: string) {
    try {
      await signInAndGo(emailToUse, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const lower = message.toLowerCase();

      if (lower.includes("email not confirmed") || lower.includes("email confirmation")) {
        // Attempt DB-side confirm (no email), then retry once
        const confirmed = await confirmViaRpc(emailToUse);
        if (confirmed) {
          try {
            await signInAndGo(emailToUse, password);
            return;
          } catch {
            /* fall through */
          }
        }

        // Last resort: re-init via server (confirms + sets password)
        try {
          await initializeAdminAccount({ data: { email: emailToUse, password } });
          await signInAndGo(emailToUse, password);
          return;
        } catch {
          /* fall through */
        }

        throw new Error(
          "Your email is not confirmed and Supabase is not sending mail. Quick fix: Lovable → Cloud → Users → find shaan.09042@gmail.com → confirm the user (or Auth settings → enable Auto-confirm email). Then sign in again."
        );
      }

      if (lower.includes("invalid login credentials")) {
        throw new Error(
          "Wrong password, or the account still isn’t confirmed. Use “Initialize / Set Password”, or confirm your user in Lovable Cloud → Users (mail is not being delivered)."
        );
      }

      throw err instanceof Error ? err : new Error(message);
    }
  }

  async function handleResetPassword() {
    const emailToUse = resolveEmail(identifier);
    if (!emailToUse.includes("@")) {
      toast.error("Enter your email first, then click Reset password.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw error;
      toast.success("Password reset email sent. Check your inbox and spam folder.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const emailToUse = resolveEmail(identifier);

    try {
      if (mode === "signup") {
        await handleInitialize(emailToUse);
      } else {
        await handleSignIn(emailToUse);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function handleSelectAdmin(admin: (typeof TEAM_ADMINS)[0]) {
    setIdentifier(admin.email);
    toast.info(`Selected ${admin.name} (${admin.email})`);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 px-4 py-16 text-foreground">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-400/20 blur-[130px] animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-900/85 p-8 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl sm:p-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400/80 transition-colors hover:text-emerald-300"
          >
            &larr; Back to public site
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin Secure Portal
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/30">
            <Leaf className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Logivra Hub
            </h1>
            <p className="text-xs text-emerald-400/80">
              Environmental & Compliance Intelligence
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-slate-100">
            {mode === "signin" ? "Team Admin Sign In" : "Initialize / Set Admin Password"}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Authorized administrative access for Shrawan, Shivank, and designated team leads.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5" /> Team Admin Profiles:
            </span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {TEAM_ADMINS.map((admin) => (
              <button
                key={admin.username}
                type="button"
                onClick={() => handleSelectAdmin(admin)}
                className={`group flex flex-col rounded-xl border p-2 text-left transition-all btn-dynamic ${
                  identifier === admin.email || identifier === admin.username
                    ? "border-emerald-400 bg-emerald-500/20 shadow-md shadow-emerald-500/20"
                    : "border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-emerald-950/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white group-hover:text-emerald-300">
                    {admin.name}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      admin.status === "Active" ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {admin.status === "Active" ? admin.role : "Will assign"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="identifier" className="text-xs font-medium text-slate-300">
              Username or Work Email
            </Label>
            <Input
              id="identifier"
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1.5 h-11 border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 focus-visible:border-emerald-400 focus-visible:ring-emerald-400"
              placeholder="e.g. shrawan, shivank, or email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-slate-300">
                Password
              </Label>
              {mode === "signin" ? (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300"
                >
                  First time? Set password
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={busy}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                >
                  Reset via email
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11 border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 focus-visible:border-emerald-400 focus-visible:ring-emerald-400"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="btn-dynamic mt-2 h-11 w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500"
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Authenticating...
              </span>
            ) : mode === "signin" ? (
              <span className="flex items-center justify-center gap-2">
                Sign in to Dashboard <ArrowRight className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Initialize Admin Account <KeyRound className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs text-slate-400 hover:text-emerald-300 transition-colors"
          >
            {mode === "signin"
              ? "Login failing? Click here to re-initialize your password"
              : "Already set your password? Return to Sign In"}
          </button>
          {mode === "signin" && (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={busy}
              className="text-[11px] text-slate-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
            >
              Forgot password? Email me a reset link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
