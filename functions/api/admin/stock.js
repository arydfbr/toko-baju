import { json, isCheckError } from "../../../lib/shared.js";

// POST /api/admin/stock  { id, delta }  → tambah/kurangi stok (restock, barang rusak, dll.)
export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: "Data tidak valid." }, 400); }
  const delta = Math.trunc(Number(b.delta));
  if (!b.id || !Number.isFinite(delta) || delta === 0) return json({ error: "Isi jumlah perubahan stok." }, 400);
  try {
    const r = await env.DB.prepare("UPDATE variants SET stock = stock + ? WHERE id = ?").bind(delta, String(b.id)).run();
    if (!r.meta.changes) return json({ error: "Varian tidak ditemukan." }, 404);
  } catch (e) {
    if (isCheckError(e)) return json({ error: "Stok tidak bisa kurang dari 0." }, 400);
    throw e;
  }
  return json({ ok: true });
}
