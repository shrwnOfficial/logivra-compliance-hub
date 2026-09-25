import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { GreenUdyogLogo } from "@/components/landing/GreenUdyogLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { adminFetch, getApiUrl } from "@/lib/api";
import { getAccessToken, isAdminUser } from "@/lib/admin-auth";

const title = "Admin — GreenUdyog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title }, { name: "robots", content: "noindex" }],
  }),
  beforeLoad: async () => {
    const ok = await isAdminUser();
    if (!ok) {
      throw redirect({
        to: "/auth",
        search: { redirect: "/admin" },
      });
    }
  },
  component: AdminPage,
});

type Booking = {
  id: string;
  email: string;
  full_name: string;
  company: string | null;
  phone: string | null;
  status: string;
  booking_type: string;
  pollution_interests: string[] | null;
  preferred_callback: string | null;
  created_at: string;
  consultation_slots: { starts_at: string; ends_at: string } | null;
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [meetingUrl, setMeetingUrl] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_bookings")
        .select("*, consultation_slots(starts_at, ends_at)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const { data: events } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_events")
        .select("event_name, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: apiAnalytics } = useQuery({
    queryKey: ["admin-analytics-api"],
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token || !getApiUrl()) return null;
      return adminFetch<Record<string, unknown>>("/api/admin/analytics", token);
    },
  });

  const analytics = useMemo(() => {
    if (apiAnalytics) return apiAnalytics;
    const list = bookings ?? [];
    const by_status: Record<string, number> = {};
    const by_day: Record<string, number> = {};
    const interests: Record<string, number> = {};
    for (const b of list) {
      by_status[b.status] = (by_status[b.status] ?? 0) + 1;
      const day = b.created_at.slice(0, 10);
      by_day[day] = (by_day[day] ?? 0) + 1;
      for (const t of b.pollution_interests ?? []) {
        interests[t] = (interests[t] ?? 0) + 1;
      }
    }
    const funnel: Record<string, number> = {};
    for (const e of events ?? []) {
      funnel[e.event_name] = (funnel[e.event_name] ?? 0) + 1;
    }
    return {
      total_bookings: list.length,
      by_status,
      bookings_by_day: by_day,
      pollution_interests: interests,
      funnel,
      callback_requests: list.filter((b) => b.booking_type === "callback_request").length,
      slot_utilization_pct: 0,
    };
  }, [apiAnalytics, bookings, events]);

  const chartData = useMemo(() => {
    const byDay = (analytics.bookings_by_day ?? {}) as Record<string, number>;
    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, count]) => ({ date, count }));
  }, [analytics]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("consultation_bookings").update({ status }).eq("id", id);
    if (error) {
      toast.error("Could not update status.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  async function saveMeetingUrl() {
    const { error } = await supabase
      .from("admin_settings")
      .update({ value: meetingUrl, updated_at: new Date().toISOString() })
      .eq("key", "default_meeting_url");
    if (error) {
      toast.error("Could not save meeting link.");
      return;
    }
    toast.success("Meeting link saved.");
  }

  async function addSlot() {
    if (!slotStart || !slotEnd) return;
    const { error } = await supabase.from("consultation_slots").insert({
      starts_at: new Date(slotStart).toISOString(),
      ends_at: new Date(slotEnd).toISOString(),
      is_booked: false,
    });
    if (error) {
      toast.error("Could not add slot.");
      return;
    }
    setSlotStart("");
    setSlotEnd("");
    toast.success("Slot added.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  }

  const byStatus = (analytics.by_status ?? {}) as Record<string, number>;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <GreenUdyogLogo className="h-9 w-9" />
            <span className="font-display text-lg font-semibold">GreenUdyog Admin</span>
          </Link>
          <Button variant="outline" size="sm" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="text-sm text-muted-foreground">Emissions clarity for small manufacturers</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Dashboard</h1>

        <Tabs defaultValue="analytics" className="mt-8">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="slots">Slots & settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total leads", value: analytics.total_bookings ?? 0 },
                { label: "Callbacks", value: analytics.callback_requests ?? 0 },
                { label: "New", value: byStatus.new ?? 0 },
                { label: "Confirmed", value: byStatus.confirmed ?? 0 },
              ].map((k) => (
                <div key={k.label} className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
                  <p className="mt-2 text-3xl font-semibold">{k.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-background p-5">
              <h2 className="font-semibold">Bookings (last 14 days)</h2>
              {chartData.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No data yet.</p>
              ) : (
                <ChartContainer
                  config={{ count: { label: "Bookings", color: "hsl(158 60% 40%)" } }}
                  className="mt-4 h-64 w-full"
                >
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis allowDecimals={false} width={32} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                  </BarChart>
                </ChartContainer>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-5">
                <h2 className="font-semibold">Funnel events</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {Object.entries((analytics.funnel ?? {}) as Record<string, number>).map(
                    ([name, count]) => (
                      <li key={name} className="flex justify-between">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="font-medium">{count}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-background p-5">
                <h2 className="font-semibold">Pollution interests</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {Object.entries(
                    (analytics.pollution_interests ?? {}) as Record<string, number>,
                  ).map(([tag, count]) => (
                    <li key={tag} className="flex justify-between gap-2">
                      <span className="text-muted-foreground">{tag}</span>
                      <span className="font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">When</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {(bookings ?? []).map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-muted-foreground">
                          {b.consultation_slots?.starts_at
                            ? new Date(b.consultation_slots.starts_at).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })
                            : new Date(b.created_at).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{b.full_name}</div>
                          <div className="text-muted-foreground">{b.email}</div>
                          <div className="text-xs text-muted-foreground">{b.company}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">
                            {b.booking_type === "callback_request" ? "Callback" : "Free call"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge>{b.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <select
                            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                            value={b.status}
                            onChange={(e) => void updateStatus(b.id, e.target.value)}
                          >
                            {["new", "confirmed", "completed", "cancelled"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="slots" className="mt-6 space-y-8">
            <div className="rounded-2xl border border-border bg-background p-5">
              <h2 className="font-semibold">Default Google Meet / Zoom URL</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Included in confirmation emails when the API sends notifications.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Input
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                />
                <Button onClick={() => void saveMeetingUrl()}>Save</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <h2 className="font-semibold">Add consultation slot (IST)</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Starts</Label>
                  <Input
                    type="datetime-local"
                    value={slotStart}
                    onChange={(e) => setSlotStart(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Ends</Label>
                  <Input
                    type="datetime-local"
                    value={slotEnd}
                    onChange={(e) => setSlotEnd(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <Button className="mt-4" onClick={() => void addSlot()}>
                Add slot
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
