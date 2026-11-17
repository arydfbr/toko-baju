import { json, releaseExpired } from "../../../lib/shared.js";

// GET /api/order/KS-XXXXXX — status pesanan untuk pembeli (tanpa alamat/nomor HP)
export async function onRequestGet({ params, env }) {
  const db = env.DB;
  await releaseExpired(db);
  const o = await db
    .prepare(
      `SELECT id, code, status, subtotal, shipping_id, shipping_label, shipping_cost, unique_code, total,
              expires_at, courier, resi, created_at FROM orders WHERE code = ?`
    )
    .bind(String(params.code || "").toUpperCase())
    .first();
  if (!o) return json({ error: "Pesanan tidak ditemukan." }, 404);
  const { results: items } = await db
    .prepare("SELECT v.color, v.size, i.qty FROM order_items i JOIN variants v ON v.id = i.variant_id WHERE i.order_id = ?")
    .bind(o.id)
    .all();
  delete o.id;
  return json({ ...o, items });
}
