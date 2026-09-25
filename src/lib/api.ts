import { supabase } from "@/integrations/supabase/client";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");

export type ConsultationSlot = {
  id: string;
  starts_at: string;
  ends_at: string;
};

export async function fetchAvailableSlots(): Promise<ConsultationSlot[]> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/api/slots/available`);
    if (!res.ok) throw new Error("Could not load slots");
    return res.json();
  }
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("consultation_slots")
    .select("id, starts_at, ends_at")
    .eq("is_booked", false)
    .gte("starts_at", now)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ConsultationSlot[];
}

export async function createBooking(payload: {
  slot_id: string;
  email: string;
  full_name: string;
  company: string;
  phone: string;
  udyam_id?: string;
  pollution_interests: string[];
}) {
  if (!API_URL) {
    throw new Error("Booking API is not configured");
  }
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Booking failed");
  }
  return res.json();
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
    const res = await fetch(`${API_URL}/api/callback-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Could not send request");
    return res.json();
  }
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
  if (error) throw error;
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
