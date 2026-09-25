import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/demo-requests")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
