from typing import Any

import httpx

from app.config import settings


class SupabaseRest:
    def __init__(self) -> None:
        base = settings.supabase_url.rstrip("/")
        self.base = f"{base}/rest/v1"
        self.headers = {
            "apikey": settings.supabase_service_role_key,
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    async def get(self, table: str, query: str = "") -> list[dict[str, Any]]:
        url = f"{self.base}/{table}"
        if query:
            url = f"{url}?{query}"
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.get(url, headers=self.headers)
            r.raise_for_status()
            return r.json()

    async def post(self, table: str, body: dict[str, Any] | list[dict[str, Any]]) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(f"{self.base}/{table}", headers=self.headers, json=body)
            r.raise_for_status()
            data = r.json()
            return data if isinstance(data, list) else [data]

    async def patch(self, table: str, body: dict[str, Any], query: str) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.patch(
                f"{self.base}/{table}?{query}",
                headers=self.headers,
                json=body,
            )
            r.raise_for_status()
            data = r.json()
            return data if isinstance(data, list) else [data]

    async def rpc(self, fn: str, body: dict[str, Any]) -> Any:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(
                f"{settings.supabase_url.rstrip('/')}/rest/v1/rpc/{fn}",
                headers=self.headers,
                json=body,
            )
            r.raise_for_status()
            return r.json()


def db() -> SupabaseRest:
    return SupabaseRest()
