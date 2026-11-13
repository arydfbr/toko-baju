import { json } from "../../../lib/shared.js";

// Semua /api/admin/* wajib mengirim header x-admin-key = ADMIN_PASSWORD
export async function onRequest({ request, env, next }) {
  const key = request.headers.get("x-admin-key") || "";
  if (!env.ADMIN_PASSWORD || key !== env.ADMIN_PASSWORD) return json({ error: "Password salah." }, 401);
  return next();
}
