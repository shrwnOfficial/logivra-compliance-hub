import httpx

from app.config import settings


async def send_email(to: list[str], subject: str, html: str) -> None:
    if not settings.resend_api_key:
        return
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.resend_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": settings.from_email,
                "to": to,
                "subject": subject,
                "html": html,
            },
        )
        r.raise_for_status()


async def notify_booking(
    *,
    client_email: str,
    client_name: str,
    company: str,
    starts_at_ist: str,
    meeting_url: str,
    booking_id: str,
) -> None:
    admin_html = f"""
    <p>New <strong>free consultation</strong> booked on GreenUdyog.</p>
    <ul>
      <li><strong>Name:</strong> {client_name}</li>
      <li><strong>Email:</strong> {client_email}</li>
      <li><strong>Company:</strong> {company}</li>
      <li><strong>Slot (IST):</strong> {starts_at_ist}</li>
      <li><strong>Booking ID:</strong> {booking_id}</li>
    </ul>
    """
    client_html = f"""
    <p>Hi {client_name},</p>
    <p>Your free online EHS consultation with <strong>GreenUdyog</strong> is confirmed.</p>
    <p><strong>When (IST):</strong> {starts_at_ist}</p>
    <p><strong>Join link:</strong> <a href="{meeting_url}">{meeting_url or "We will email you the link shortly."}</a></p>
    <p>Compliance for small manufacturers — we look forward to speaking with you.</p>
    """
    if settings.admin_emails:
        await send_email(settings.admin_emails, "New GreenUdyog consultation booking", admin_html)
    await send_email([client_email], "Your GreenUdyog consultation is confirmed", client_html)
