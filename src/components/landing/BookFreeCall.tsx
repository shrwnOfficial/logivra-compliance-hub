import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createBooking,
  createCallbackRequest,
  fetchAvailableSlots,
  trackSiteEvent,
  type ConsultationSlot,
} from "@/lib/api";

const INTERESTS = [
  "Stack emissions & consent limits (PM, SO₂, NOx)",
  "Carbon / fuel use & energy records",
  "Boiler, furnace & DG set compliance",
  "Stack monitoring & lab reports",
  "SPCB notice or exceedance follow-up",
  "Buyer carbon / ESG questionnaires",
];

function formatSlotIST(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookFreeCall() {
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotId, setSlotId] = useState("");
  const [mode, setMode] = useState<"slot" | "callback">("slot");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [udyam, setUdyam] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [callbackNote, setCallbackNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    void trackSiteEvent("page_view", { page: "landing" });
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest('a[href="#demo"]');
      if (!link) return;
      e.preventDefault();
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#demo");
      setFlash(true);
      window.setTimeout(() => setFlash(false), 1600);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAvailableSlots();
        if (!cancelled) setSlots(data.slice(0, 24));
      } catch {
        if (!cancelled) toast.error("Could not load consultation slots.");
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, ConsultationSlot[]>();
    for (const s of slots) {
      const day = new Date(s.starts_at).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "numeric",
        month: "short",
      });
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(s);
    }
    return map;
  }, [slots]);

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    void trackSiteEvent("booking_started", { mode });
    try {
      if (mode === "slot") {
        if (!slotId) {
          toast.error("Please choose a time slot.");
          return;
        }
        await createBooking({
          slot_id: slotId,
          email: email.trim(),
          full_name: fullName.trim(),
          company: company.trim(),
          phone: phone.trim(),
          udyam_id: udyam.trim() || undefined,
          pollution_interests: interests,
        });
      } else {
        await createCallbackRequest({
          email: email.trim(),
          full_name: fullName.trim(),
          company: company.trim(),
          phone: phone.trim(),
          preferred_callback: callbackNote.trim(),
          pollution_interests: interests,
        });
      }
      void trackSiteEvent("booking_completed", { mode });
      setDone(true);
      toast.success(
        mode === "slot"
          ? "Your free call is booked. Check your email for the meeting link."
          : "We received your callback request.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="demo"
      className={`scroll-mt-16 border-t border-border bg-deep-gradient transition-shadow duration-500 ${
        flash ? "shadow-[inset_0_0_0_4px_oklch(0.75_0.15_155)]" : ""
      }`}
    >
      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-primary-foreground sm:text-4xl">
            Book a free online consultation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            30 minutes with our team — carbon footprint basics, stack air pollutants, monitoring
            schedules, and what triggers SPCB or CPCB scrutiny for Indian MSMEs. No consultant fees
            for this call.
          </p>
        </div>

        {done ? (
          <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-background/15 p-8 text-center backdrop-blur">
            <p className="text-lg font-medium text-primary-foreground">You are all set.</p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              We sent a confirmation to your email. Times are in India Standard Time (IST).
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-4 text-xs text-primary-foreground/70 underline"
            >
              Book another slot
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 space-y-6 rounded-2xl border border-primary-foreground/20 bg-background/95 p-6 shadow-xl backdrop-blur sm:p-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                size="cta"
                variant={mode === "slot" ? "default" : "outline"}
                onClick={() => setMode("slot")}
              >
                Pick a time slot
              </Button>
              <Button
                type="button"
                size="cta"
                variant={mode === "callback" ? "default" : "outline"}
                onClick={() => setMode("callback")}
              >
                Request a callback
              </Button>
            </div>

            {mode === "slot" && (
              <div className="space-y-3">
                <Label className="text-foreground">Available slots (IST)</Label>
                {loadingSlots ? (
                  <p className="text-sm text-muted-foreground">Loading slots…</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No slots open right now — use callback request and we will reach out.
                  </p>
                ) : (
                  <div className="max-h-48 space-y-3 overflow-y-auto rounded-xl border border-border p-3">
                    {[...slotsByDay.entries()].map(([day, daySlots]) => (
                      <div key={day}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {day}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {daySlots.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSlotId(s.id)}
                              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                slotId === s.id
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background hover:border-primary"
                              }`}
                            >
                              {formatSlotIST(s.starts_at)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mode === "callback" && (
              <div>
                <Label htmlFor="callback">Preferred days / times</Label>
                <Textarea
                  id="callback"
                  required
                  value={callbackNote}
                  onChange={(e) => setCallbackNote(e.target.value)}
                  placeholder="e.g. Weekday evenings after 5 PM IST"
                  className="mt-2"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Your name</Label>
                <Input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="company">Company / plant</Label>
                <Input
                  id="company"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="udyam">Udyam registration (optional)</Label>
                <Input
                  id="udyam"
                  value={udyam}
                  onChange={(e) => setUdyam(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">What do you need help with?</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {INTERESTS.map((tag) => (
                  <label
                    key={tag}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={interests.includes(tag)}
                      onCheckedChange={() => toggleInterest(tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" size="cta" disabled={busy}>
              {busy
                ? "Submitting…"
                : mode === "slot"
                  ? "Confirm free call"
                  : "Send callback request"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground">
              By submitting, you agree we may contact you about compliance services. We handle data
              per India&apos;s DPDP Act. This is not legal advice — always confirm with your SPCB or
              counsel.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
