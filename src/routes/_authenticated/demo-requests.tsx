import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Leaf,
  Users,
  Inbox,
  CheckCircle2,
  Clock,
  UserPlus,
  ShieldCheck,
  Search,
  Copy,
  LogOut,
  Mail,
  Phone,
  Building,
  Sparkles,
} from "lucide-react";

const title = "Logivra Admin Hub — Demo Requests & Team Access";
const description = "Internal management dashboard for Logivra compliance inquiries and team access.";

export const Route = createFileRoute("/_authenticated/demo-requests")({
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
  component: DemoRequestsPage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-surface p-10 text-center">
      <div className="max-w-md rounded-2xl border border-border bg-background p-8">
        <p className="text-base font-semibold text-foreground">Couldn't load dashboard</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account may still need administrator permissions assigned in Supabase.
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Page not found.</div>
  ),
});

type DemoRequest = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
};

type TeamAdmin = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending Assignment";
};

function DemoRequestsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"requests" | "team">("requests");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted">("all");

  // State for team admins (Shrawan, Shivank, User 3 slot)
  const [teamAdmins, setTeamAdmins] = useState<TeamAdmin[]>([
    {
      id: "1",
      name: "Shrawan",
      email: "shaan.09042@gmail.com",
      role: "Admin (Full Access)",
      status: "Active",
    },
    {
      id: "2",
      name: "Shivank",
      email: "shivnakrao7@gmail.com",
      role: "Admin (Full Access)",
      status: "Active",
    },
    {
      id: "3",
      name: "Admin 3 (Slot Reserved)",
      email: "Pending designation",
      role: "Admin",
      status: "Pending Assignment",
    },
  ]);

  const [user3Name, setUser3Name] = useState("");
  const [user3Email, setUser3Email] = useState("");
  const [showUser3Modal, setShowUser3Modal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["demo-requests"],
    queryFn: async (): Promise<DemoRequest[]> => {
      const { data, error } = await supabase
        .from("demo_requests")
        .select("id, email, full_name, company, phone, message, source, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DemoRequest[];
    },
  });

  async function markContacted(id: string, currentStatus: string) {
    const next = currentStatus === "contacted" ? "new" : "contacted";
    const { error } = await supabase
      .from("demo_requests")
      .update({ status: next })
      .eq("id", id);
    if (error) {
      toast.error("Couldn't update this request.");
      return;
    }
    toast.success(`Marked as ${next === "contacted" ? "Contacted" : "New"}`);
    void queryClient.invalidateQueries({ queryKey: ["demo-requests"] });
  }

  function copyEmails() {
    const emails = (data ?? []).map((r) => r.email).join(", ");
    void navigator.clipboard.writeText(emails);
    toast.success("All lead emails copied to clipboard.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/admin" });
  }

  function handleAssignUser3(e: React.FormEvent) {
    e.preventDefault();
    if (!user3Name.trim() || !user3Email.trim()) {
      toast.error("Please provide both name and email for Admin 3.");
      return;
    }

    setTeamAdmins((prev) =>
      prev.map((a) =>
        a.id === "3"
          ? {
              ...a,
              name: user3Name.trim(),
              email: user3Email.trim().toLowerCase(),
              status: "Active",
            }
          : a
      )
    );

    toast.success(`Admin 3 designated as ${user3Name} (${user3Email})!`);
    setShowUser3Modal(false);
  }

  // Filter requests
  const filteredRequests = (data ?? []).filter((r) => {
    const matchesSearch =
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.company && r.company.toLowerCase().includes(search.toLowerCase())) ||
      (r.full_name && r.full_name.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      statusFilter === "all" ? true : r.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const totalCount = data?.length ?? 0;
  const newCount = (data ?? []).filter((r) => r.status === "new").length;
  const contactedCount = (data ?? []).filter((r) => r.status === "contacted").length;

  return (
    <div className="min-h-screen bg-surface-gradient">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-emerald-500/20 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-emerald-500/20">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Logivra
              </span>
            </Link>
            <span className="hidden sm:inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              Admin Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-border bg-background p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("requests")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                  activeTab === "requests"
                    ? "bg-brand-gradient text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Inbox className="h-3.5 w-3.5" /> Demo Inquiries ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("team")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                  activeTab === "team"
                    ? "bg-brand-gradient text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-3.5 w-3.5" /> Team Admins (3)
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="btn-dynamic border-border text-xs gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* TAB 1: DEMO REQUESTS */}
        {activeTab === "requests" && (
          <div>
            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card rounded-2xl p-5 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Inquiries
                  </span>
                  <Inbox className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-2 text-3xl font-bold font-display text-foreground">
                  {totalCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Prospective plant clients</p>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    New / Uncontacted
                  </span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <p className="mt-2 text-3xl font-bold font-display text-amber-600">
                  {newCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Needs follow up</p>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contacted
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-2 text-3xl font-bold font-display text-emerald-600">
                  {contactedCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Demo scheduled or held</p>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, company, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 pl-9 border-border bg-background"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-border bg-background p-1 text-xs font-medium">
                  {(["all", "new", "contacted"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setStatusFilter(mode)}
                      className={`px-3 py-1 rounded capitalize transition-all ${
                        statusFilter === mode
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={copyEmails}
                  disabled={!data?.length}
                  variant="outline"
                  size="sm"
                  className="btn-dynamic border-border gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Emails
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="mt-6 space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
                Failed to load requests from database. Please check Supabase permissions.
              </div>
            )}

            {!isLoading && !error && filteredRequests.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-emerald-500/30 bg-background/60 p-12 text-center backdrop-blur">
                <Inbox className="mx-auto h-10 w-10 text-emerald-600/60" />
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  No inquiries match your filter
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Demo requests submitted from the public site will appear here live.
                </p>
              </div>
            )}

            {!isLoading && !!filteredRequests.length && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-background/90 shadow-sm backdrop-blur">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-emerald-950/5 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Date</th>
                        <th className="px-5 py-3 font-semibold">Contact Email</th>
                        <th className="px-5 py-3 font-semibold">Name</th>
                        <th className="px-5 py-3 font-semibold">Company / Plant</th>
                        <th className="px-5 py-3 font-semibold">Phone</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRequests.map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-emerald-500/[0.03] transition-colors"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-4">
                            <a
                              href={`mailto:${r.email}`}
                              className="font-medium text-foreground hover:text-emerald-600 flex items-center gap-1.5"
                            >
                              <Mail className="h-3.5 w-3.5 text-emerald-600" />
                              {r.email}
                            </a>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground font-medium">
                            {r.full_name || "—"}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {r.company ? (
                              <span className="flex items-center gap-1.5">
                                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                {r.company}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {r.phone ? (
                              <a
                                href={`tel:${r.phone}`}
                                className="flex items-center gap-1.5 hover:text-emerald-600"
                              >
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                {r.phone}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              className={
                                r.status === "contacted"
                                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                              }
                            >
                              {r.status === "contacted" ? "Contacted" : "New"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Button
                              size="sm"
                              variant={r.status === "contacted" ? "outline" : "default"}
                              className={`btn-dynamic text-xs h-8 ${
                                r.status !== "contacted"
                                  ? "bg-brand-gradient text-white shadow-sm"
                                  : "border-border"
                              }`}
                              onClick={() => void markContacted(r.id, r.status)}
                            >
                              {r.status === "contacted" ? "Mark as New" : "Mark Contacted"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEAM ADMIN MANAGEMENT */}
        {activeTab === "team" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Admin Team Access
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage the 3 designated team members with administrative authority over Logivra.
                </p>
              </div>

              <Button
                onClick={() => setShowUser3Modal(true)}
                className="btn-dynamic bg-brand-gradient text-white shadow-md shadow-emerald-500/20 gap-2"
              >
                <UserPlus className="h-4 w-4" /> Designate Team Admin 3
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {teamAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="glass-card rounded-2xl p-6 border border-emerald-500/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-sm">
                        {admin.name.charAt(0)}
                      </span>
                      <Badge
                        className={
                          admin.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                        }
                      >
                        {admin.status}
                      </Badge>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-foreground">
                      {admin.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Mail className="h-3.5 w-3.5 text-emerald-600" />
                      {admin.email}
                    </p>

                    <div className="mt-4 rounded-xl bg-surface p-3 text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Role:</span>
                        <span className="font-semibold text-foreground">{admin.role}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Access Level:</span>
                        <span className="text-emerald-700 font-medium">Read / Write / RLS Override</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified Admin
                    </span>
                    {admin.id === "3" && (
                      <button
                        onClick={() => setShowUser3Modal(true)}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Edit Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal to configure User 3 */}
            {showUser3Modal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-background p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">
                      Designate Team Admin 3
                    </h3>
                    <button
                      onClick={() => setShowUser3Modal(false)}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Specify the third team member's full name and email address to grant them
                    admin access.
                  </p>

                  <form onSubmit={handleAssignUser3} className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-foreground">
                        Full Name
                      </label>
                      <Input
                        required
                        placeholder="e.g. Alex Morgan"
                        value={user3Name}
                        onChange={(e) => setUser3Name(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground">
                        Work Email
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="alex@example.com"
                        value={user3Email}
                        onChange={(e) => setUser3Email(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUser3Modal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="btn-dynamic bg-brand-gradient text-white"
                      >
                        Save & Assign Admin
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
