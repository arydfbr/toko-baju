import { CONFIG, json, releaseExpired } from "../../../lib/shared.js";

// GET /api/admin/dashboard — pesanan, stok, dan rekap penjualan
export async function onRequestGet({ env }) {
  const db = env.DB;
  await releaseExpired(db);

  const [orders, items, variants, sales, totals] = await db.batch([
    db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 300"),
    db.prepare(
      `SELECT i.order_id, v.color, v.size, i.qty FROM order_items i JOIN variants v ON v.id = i.variant_id
       WHERE i.order_id IN (SELECT id FROM orders ORDER BY created_at DESC LIMIT 300) ORDER BY v.sort`
    ),
    db.prepare("SELECT id, color, size, stock FROM variants ORDER BY sort"),
    db.prepare(
      `SELECT v.id, v.color, v.size,
              COALESCE(SUM(CASE WHEN o.status IN ('paid','shipped') THEN i.qty END), 0) AS sold,
              COALESCE(SUM(CASE WHEN o.status = 'pending' THEN i.qty END), 0) AS reserved
       FROM variants v
       LEFT JOIN order_items i ON i.variant_id = v.id
       LEFT JOIN orders o ON o.id = i.order_id
       GROUP BY v.id ORDER BY v.sort`
    ),
    db.prepare(
      `SELECT COUNT(*) AS orders, COALESCE(SUM(subtotal), 0) AS revenue
       FROM orders WHERE status IN ('paid','shipped')`
    ),
  ]);

  const byOrder = {};
  for (const it of items.results) (byOrder[it.order_id] ||= []).push(it);
  const list = orders.results.map((o) => ({ ...o, items: byOrder[o.id] || [] }));

  return json({
    config: CONFIG,
    orders: list,
    variants: variants.results,
    sales: sales.results,
    totals: totals.results[0],
  });
}
