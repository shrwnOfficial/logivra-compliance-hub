from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", "../.env"), extra="ignore")

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""
    resend_api_key: str = ""
    admin_notify_emails: str = (
        "shaan.09042@gmail.com,shivankrao7@gmail.com,suryashubohit@gmail.com"
    )
    default_meeting_url: str = ""
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:3000"
    from_email: str = "Sankalp <onboarding@resend.dev>"
    # Off by default until a domain is verified in Resend (onboarding@resend.dev cannot reach clients).
    send_booking_emails: bool = False

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def admin_emails(self) -> list[str]:
        return [e.strip().lower() for e in self.admin_notify_emails.split(",") if e.strip()]


settings = Settings()
