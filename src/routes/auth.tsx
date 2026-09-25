import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy /auth URL — permanently redirect to /admin */
export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
