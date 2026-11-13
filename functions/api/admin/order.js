import { json, restockAndSetStatus, isCheckError } from "../../../lib/shared.js";

// POST /api/admin/order  { code, action: "paid" | "ship" | "cancel", courier?, resi? }
export async function onRequestPost({ request, env }) {
  const db = env.DB;
  let b;
  try { b = await request.json(); } catch { return json({ error: "Data tidak valid." }, 400); }

  const o = await db.prepare("SELECT id, status FROM orders WHERE code = ?").bind(String(b.code || "")).first();
  if (!o) return json({ error: "Pesanan tidak ditemukan." }, 404);
  const now = Date.now();

  if (b.action === "paid") {
    if (o.status === "pending") {
      await db.prepare("UPDATE orders SET status = 'paid', paid_at = ? WHERE id = ? AND status = 'pending'").bind(now, o.id).run();
    } else if (o.status === "expired") {
      // Pembeli transfer setelah batas waktu: stok sudah dikembalikan, jadi potong lagi (kalau masih ada)
      try {
        await db.batch([
          db.prepare(
            `UPDATE variants SET stock = stock - (SELECT SUM(qty) FROM order_items WHERE order_id = ?1 AND variant_id = variants.id)
             WHERE id IN (SELECT variant_id FROM order_items WHERE order_id = ?1)
               AND EXISTS (SELECT 1 FROM orders WHERE id = ?1 AND status = 'expired')`
          ).bind(o.id),
          db.prepare("UPDATE orders SET status = 'paid', paid_at = ?2 WHERE id = ?1 AND status = 'expired'").bind(o.id, now),
        ]);
      } catch (e) {
        if (isCheckError(e)) return json({ error: "Pesanan ini sudah kedaluwarsa dan stoknya sudah terjual ke orang lain. Hubungi pembeli untuk ganti varian atau refund." }, 409);
        throw e;
      }
    } else {
      return json({ error: `Pesanan berstatus "${o.status}", tidak bisa ditandai lunas.` }, 400);
    }
  } else if (b.action === "ship") {
    const resi = String(b.resi || "").trim().slice(0, 60);
    const courier = String(b.courier || "").trim().slice(0, 40);
    if (!resi || !courier) return json({ error: "Isi nama kurir dan nomor resi." }, 400);
    if (!["paid", "shipped"].includes(o.status)) return json({ error: "Hanya pesanan lunas yang bisa dikirim." }, 400);
    await db
      .prepare("UPDATE orders SET status = 'shipped', courier = ?, resi = ?, shipped_at = COALESCE(shipped_at, ?) WHERE id = ?")
      .bind(courier, resi, now, o.id)
      .run();
  } else if (b.action === "cancel") {
    if (!["pending", "paid"].includes(o.status)) return json({ error: `Pesanan berstatus "${o.status}", tidak bisa dibatalkan.` }, 400);
    await db.batch(restockAndSetStatus(db, o.id, "cancelled", ["pending", "paid"]));
  } else {
    return json({ error: "Aksi tidak dikenal." }, 400);
  }
  return json({ ok: true });
}
