import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isAllowlistedAdminEmail } from "@/lib/admin-allowlist";
import { isAdminUser } from "@/lib/admin-auth";

const title = "GreenUdyog team sign in";
const description = "Sign in to the GreenUdyog admin workspace.";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === "string" && search.redirect.startsWith("/")
        ? search.redirect
        : "/admin",
  }),
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
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect: afterAuth } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(async ({ data }) => {
      if (data.session && (await isAdminUser())) navigate({ to: afterAuth });
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session && (await isAdminUser())) {
        navigate({ to: afterAuth });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, afterAuth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const normalized = email.trim().toLowerCase();
      if (!isAllowlistedAdminEmail(normalized)) {
        toast.error("This email is not authorized for admin access.");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });
      if (error) throw error;
      if (!(await isAdminUser())) {
        await supabase.auth.signOut();
        toast.error(
          "Account exists but admin role is missing. Ask the team to run: bun run seed:admins",
        );
        return;
      }
      navigate({ to: afterAuth });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth`,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try again.");
      return;
    }
    if (result.redirected) return;
    const { data } = await supabase.auth.getUser();
    const googleEmail = data.user?.email?.toLowerCase();
    if (!googleEmail || !isAllowlistedAdminEmail(googleEmail)) {
      await supabase.auth.signOut();
      toast.error("This Google account is not authorized for admin access.");
      return;
    }
    if (!(await isAdminUser())) {
      await supabase.auth.signOut();
      toast.error("Admin role missing. Run seed:admins for this email.");
      return;
    }
    navigate({ to: afterAuth });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-7">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          &larr; Back to site
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Sign in to GreenUdyog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Founder admin access only (Shrawan, Shivank, Surya). Use the team password provided at
          setup — accounts are pre-created; no signup or confirmation email needed.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11"
              placeholder="shaan.09042@gmail.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11"
            />
          </div>
          <Button type="submit" disabled={busy} className="h-11 w-full text-base">
            {busy ? "Please wait…" : "Sign in"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          className="h-11 w-full border-border text-base"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
