from datetime import datetime, timezone
from typing import Any
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.auth.jwt import require_admin
from app.config import settings
from app.services.email_service import notify_booking
from app.services.supabase_client import db

router = APIRouter(tags=["bookings"])
IST = ZoneInfo("Asia/Kolkata")


class BookingCreate(BaseModel):
    slot_id: str
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    company: str = Field(min_length=1, max_length=200)
    phone: str = Field(min_length=8, max_length=20)
    udyam_id: str | None = None
    pollution_interests: list[str] = Field(default_factory=list)


class CallbackCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    company: str = Field(min_length=1, max_length=200)
    phone: str = Field(min_length=8, max_length=20)
    preferred_callback: str = Field(min_length=3, max_length=500)
    pollution_interests: list[str] = Field(default_factory=list)


class SiteEventCreate(BaseModel):
    event_name: str = Field(min_length=2, max_length=64)
    session_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class BookingStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|confirmed|completed|cancelled)$")


def _format_ist(iso: str) -> str:
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(IST).strftime("%d %b %Y, %I:%M %p IST")


async def _meeting_url() -> str:
    rows = await db().get("admin_settings", "key=eq.default_meeting_url&select=value")
    if rows and rows[0].get("value"):
        return rows[0]["value"]
    return settings.default_meeting_url


@router.get("/api/slots/available")
async def list_available_slots() -> list[dict[str, Any]]:
    now = datetime.now(timezone.utc).isoformat()
    rows = await db().get(
        "consultation_slots",
        f"is_booked=eq.false&starts_at=gte.{now}&order=starts_at.asc&select=id,starts_at,ends_at",
    )
    return rows


@router.post("/api/bookings")
async def create_booking(body: BookingCreate) -> dict[str, Any]:
    slots = await db().get(
        "consultation_slots",
        f"id=eq.{body.slot_id}&is_booked=eq.false&select=id,starts_at,ends_at",
    )
    if not slots:
        raise HTTPException(status_code=409, detail="Slot is no longer available")
    slot = slots[0]
    booking_rows = await db().post(
        "consultation_bookings",
        {
            "slot_id": body.slot_id,
            "email": body.email.lower(),
            "full_name": body.full_name,
            "company": body.company,
            "phone": body.phone,
            "udyam_id": body.udyam_id,
            "pollution_interests": body.pollution_interests,
            "booking_type": "free_call",
            "status": "new",
        },
    )
    if not booking_rows:
        raise HTTPException(status_code=500, detail="Could not create booking")
    booking = booking_rows[0]
    await db().patch("consultation_slots", {"is_booked": True}, f"id=eq.{body.slot_id}")
    meeting = await _meeting_url()
    starts_ist = _format_ist(slot["starts_at"])
    try:
        await notify_booking(
            client_email=body.email,
            client_name=body.full_name,
            company=body.company,
            starts_at_ist=starts_ist,
            meeting_url=meeting,
            booking_id=booking["id"],
        )
    except Exception:
        pass
    return {"id": booking["id"], "starts_at": slot["starts_at"], "meeting_url": meeting}


@router.post("/api/callback-requests")
async def create_callback(body: CallbackCreate) -> dict[str, str]:
    rows = await db().post(
        "consultation_bookings",
        {
            "email": body.email.lower(),
            "full_name": body.full_name,
            "company": body.company,
            "phone": body.phone,
            "pollution_interests": body.pollution_interests,
            "booking_type": "callback_request",
            "preferred_callback": body.preferred_callback,
            "status": "new",
        },
    )
    if not rows:
        raise HTTPException(status_code=500, detail="Could not save request")
    return {"id": rows[0]["id"]}


@router.post("/api/events")
async def track_event(body: SiteEventCreate) -> dict[str, str]:
    await db().post(
        "site_events",
        {
            "event_name": body.event_name,
            "session_id": body.session_id,
            "metadata": body.metadata,
        },
    )
    return {"ok": "true"}


@router.get("/api/admin/bookings")
async def admin_list_bookings(_: dict = Depends(require_admin)) -> list[dict[str, Any]]:
    return await db().get(
        "consultation_bookings",
        "order=created_at.desc&select=*,consultation_slots(starts_at,ends_at)",
    )


@router.patch("/api/admin/bookings/{booking_id}")
async def admin_update_booking(
    booking_id: str,
    body: BookingStatusUpdate,
    _: dict = Depends(require_admin),
) -> dict[str, Any]:
    rows = await db().patch(
        "consultation_bookings",
        {"status": body.status},
        f"id=eq.{booking_id}",
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Not found")
    return rows[0]


class SlotCreate(BaseModel):
    starts_at: datetime
    ends_at: datetime


@router.post("/api/admin/slots")
async def admin_create_slot(
    body: SlotCreate, _: dict = Depends(require_admin)
) -> dict[str, Any]:
    rows = await db().post(
        "consultation_slots",
        {
            "starts_at": body.starts_at.astimezone(timezone.utc).isoformat(),
            "ends_at": body.ends_at.astimezone(timezone.utc).isoformat(),
            "is_booked": False,
        },
    )
    return rows[0]


@router.get("/api/admin/analytics")
async def admin_analytics(_: dict = Depends(require_admin)) -> dict[str, Any]:
    bookings = await db().get(
        "consultation_bookings",
        "select=id,status,booking_type,created_at,pollution_interests",
    )
    events = await db().get("site_events", "select=event_name,created_at")
    by_status: dict[str, int] = {}
    by_day: dict[str, int] = {}
    interests: dict[str, int] = {}
    for b in bookings:
        st = b.get("status") or "new"
        by_status[st] = by_status.get(st, 0) + 1
        day = (b.get("created_at") or "")[:10]
        if day:
            by_day[day] = by_day.get(day, 0) + 1
        for tag in b.get("pollution_interests") or []:
            interests[tag] = interests.get(tag, 0) + 1
    funnel: dict[str, int] = {}
    for e in events:
        name = e.get("event_name") or ""
        funnel[name] = funnel.get(name, 0) + 1
    slots = await db().get("consultation_slots", "select=is_booked")
    total_slots = len(slots)
    booked_slots = sum(1 for s in slots if s.get("is_booked"))
    return {
        "total_bookings": len(bookings),
        "by_status": by_status,
        "bookings_by_day": by_day,
        "pollution_interests": interests,
        "funnel": funnel,
        "slot_utilization_pct": round((booked_slots / total_slots) * 100, 1) if total_slots else 0,
        "callback_requests": sum(1 for b in bookings if b.get("booking_type") == "callback_request"),
    }
