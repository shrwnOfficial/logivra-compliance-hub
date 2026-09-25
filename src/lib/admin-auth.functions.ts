import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Only these emails may initialize an admin password via the server. */
const ALLOWED_ADMIN_EMAILS = new Set([
  "shaan.09042@gmail.com",
  "shivnakrao7@gmail.com",
  "team-admin3@logivra.com",
]);

const InitSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Creates or updates a whitelisted admin user with a confirmed email + password.
 * Uses the service-role key so login works immediately (no confirmation email required).
 */
export const initializeAdminAccount = createServerFn({ method: "POST" })
  .validator((input) => InitSchema.parse(input))
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const { password } = data;

    if (!ALLOWED_ADMIN_EMAILS.has(email)) {
      throw new Error("This email is not authorized for admin access.");
    }

    if (!process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      throw new Error(
        "Server admin key is not configured. Falling back to client signup."
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Prefer create with auto-confirm. If the user already exists, update password + confirm.
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });

    if (!createError && created.user) {
      return { ok: true as const, action: "created" as const };
    }

    const alreadyExists =
      createError?.message?.toLowerCase().includes("already") ||
      createError?.message?.toLowerCase().includes("registered") ||
      createError?.status === 422;

    if (!alreadyExists) {
      throw new Error(createError?.message ?? "Could not create admin account.");
    }

    // Find existing user by paging (admin API has no get-by-email helper in all versions)
    let userId: string | undefined;
    let page = 1;
    const perPage = 200;

    while (!userId && page <= 10) {
      const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });
      if (listError) throw new Error(listError.message);

      const match = listed.users.find((u) => u.email?.toLowerCase() === email);
      if (match) {
        userId = match.id;
        break;
      }
      if (listed.users.length < perPage) break;
      page += 1;
    }

    if (!userId) {
      throw new Error("Admin user exists but could not be located. Contact support.");
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });

    if (updateError) throw new Error(updateError.message);

    return { ok: true as const, action: "updated" as const };
  });
