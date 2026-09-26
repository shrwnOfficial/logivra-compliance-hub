import { supabase } from "@/integrations/supabase/client";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");

export type ConsultationSlot = {
  id: string;
  starts_at: string;
  ends_at: string;
};

export function getNext3DaysSlots(): ConsultationSlot[] {
  const slots: ConsultationSlot[] = [];
  const slotTimes = [
    { hour: 10, minute: 0 },
    { hour: 11, minute: 30 },
    { hour: 14, minute: 0 },
    { hour: 15, minute: 30 },
    { hour: 17, minute: 0 },
  ];

  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = istFormatter.formatToParts(now);
  const getPart = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || "0", 10);
  const istYear = getPart("year");
  const istMonth = getPart("month") - 1;
  const istDay = getPart("day");
  const istHour = getPart("hour");

  let offset = istHour < 15 ? 0 : 1;
  let daysCount = 0;

  while (daysCount < 3) {
    const targetDate = new Date(Date.UTC(istYear, istMonth, istDay + offset));
    const dayOfWeek = targetDate.getUTCDay();

    // Skip Sunday for business appointments
    if (dayOfWeek === 0) {
      offset++;
      continue;
    }

    let addedForDay = 0;
    for (const st of slotTimes) {
      // IST is UTC+5:30 -> UTC = IST - 5h 30m
      const slotUTC = new Date(
        Date.UTC(
          targetDate.getUTCFullYear(),
          targetDate.getUTCMonth(),
          targetDate.getUTCDate(),
          st.hour - 5,
          st.minute - 30,
        ),
      );

      if (slotUTC.getTime() > now.getTime() + 30 * 60 * 1000) {
        const endUTC = new Date(slotUTC.getTime() + 30 * 60 * 1000);
        slots.push({
          id: `slot-${slotUTC.toISOString()}`,
          starts_at: slotUTC.toISOString(),
          ends_at: endUTC.toISOString(),
        });
        addedForDay++;
      }
    }

    if (addedForDay > 0) {
      daysCount++;
    }
    offset++;
  }

  return slots;
}

export async function fetchAvailableSlots(): Promise<ConsultationSlot[]> {
  const fallback = getNext3DaysSlots();
  try {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/slots/available`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    }
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("consultation_slots")
      .select("id, starts_at, ends_at")
      .eq("is_booked", false)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as ConsultationSlot[];
    }
  } catch {
    // fallback to generated slots
  }
  return fallback;
}

export async function createBooking(payload: {
  slot_id: string;
  slot_time?: string;
  email: string;
  full_name: string;
  company: string;
  phone: string;
  pollution_interests: string[];
}) {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return res.json();
      }
    } catch {
      // Fallback to direct persistence
    }
  }

  const isDbUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    payload.slot_id,
  );

  try {
    const { error } = await supabase.from("consultation_bookings").insert({
      email: payload.email,
      full_name: payload.full_name,
      company: payload.company,
      phone: payload.phone,
      preferred_callback: payload.slot_time ?? `Slot: ${payload.slot_id}`,
      pollution_interests: payload.pollution_interests,
      booking_type: "free_call",
      status: "new",
      slot_id: isDbUuid ? payload.slot_id : null,
    });
    if (!error) {
      return { id: "local", starts_at: payload.slot_time };
    }
  } catch {
    // fallback
  }

  // Fallback to demo_requests
  try {
    const slotInfo = payload.slot_time ? `Booked Slot: ${payload.slot_time}` : `Slot: ${payload.slot_id}`;
    await supabase.from("demo_requests").insert({
      email: payload.email,
      full_name: payload.full_name,
      company: payload.company,
      message: `[Free Consultation Booking]\n${slotInfo}\nPhone: ${payload.phone}\nInterests: ${payload.pollution_interests.join(", ")}`,
      source: "free_call_booking",
      status: "new",
    });
  } catch {
    // Graceful completion
  }

  return { id: "local", starts_at: payload.slot_time };
}

export async function createCallbackRequest(payload: {
  email: string;
  full_name: string;
  company: string;
  phone: string;
  preferred_callback: string;
  pollution_interests: string[];
}) {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/callback-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return res.json();
    } catch {
      // fallback
    }
  }

  try {
    const { error } = await supabase.from("consultation_bookings").insert({
      email: payload.email,
      full_name: payload.full_name,
      company: payload.company,
      phone: payload.phone,
      preferred_callback: payload.preferred_callback,
      pollution_interests: payload.pollution_interests,
      booking_type: "callback_request",
      status: "new",
    });
    if (!error) return { id: "local" };
  } catch {
    // fallback
  }

  try {
    await supabase.from("demo_requests").insert({
      email: payload.email,
      full_name: payload.full_name,
      company: payload.company,
      message: `[Callback Request]\nPreferred: ${payload.preferred_callback}\nPhone: ${payload.phone}\nInterests: ${payload.pollution_interests.join(", ")}`,
      source: "callback_request",
      status: "new",
    });
  } catch {
    // Graceful completion
  }

  return { id: "local" };
}

export async function trackSiteEvent(event_name: string, metadata: Record<string, unknown> = {}) {
  const session_id =
    typeof window !== "undefined"
      ? (window.sessionStorage.getItem("gu_session") ??
        (() => {
          const id = crypto.randomUUID();
          window.sessionStorage.setItem("gu_session", id);
          return id;
        })())
      : null;
  if (API_URL) {
    void fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name, session_id, metadata }),
    }).catch(() => undefined);
    return;
  }
  void supabase
    .from("site_events")
    .insert({ event_name, session_id, metadata })
    .then(() => undefined);
}

export async function adminFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("API not configured");
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export function getApiUrl() {
  return API_URL;
}
