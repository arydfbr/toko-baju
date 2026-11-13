import { CONFIG, json, normPhone, genCode, releaseExpired, isCheckError, priceFor } from "../../lib/shared.js";

// POST /api/checkout — buat pesanan & kunci stok
export async function onRequestPost({ request, env }) {
  const db = env.DB;
  let b;
  try { b = await request.json(); } catch { return json({ error: "Data tidak valid." }, 400); }

  const name = String(b.name || "").trim().slice(0, 80);
  const phone = normPhone(b.phone);
  const address = String(b.address || "").trim().slice(0, 500);
  const note = String(b.note || "").trim().slice(0, 200);
  const ship = CONFIG.shipping.find((s) => s.id === b.shipping);
  if (!name || !phone || !address || !ship)
    return json({ error: "Lengkapi nama, nomor WhatsApp, alamat, dan pilihan pengiriman." }, 400);

  // gabungkan item dengan varian yang sama
  const qtyById = {};
  for (const it of Array.isArray(b.items) ? b.items : []) {
    const q = Math.floor(Number(it?.qty));
    if (typeof it?.id !== "string" || !(q > 0)) continue;
    qtyById[it.id] = (qtyById[it.id] || 0) + q;
  }
  const ids = Object.keys(qtyById);
  if (!ids.length) return json({ error: "Keranjang masih kosong." }, 400);
  if (ids.some((id) => qtyById[id] > CONFIG.maxQtyPerVariant))
    return json({ error: `Maksimal ${CONFIG.maxQtyPerVariant} pcs per varian.` }, 400);

  const { results: known } = await db
    .prepare(`SELECT id, size FROM variants WHERE id IN (${ids.map(() => "?").join(",")})`)
    .bind(...ids)
    .all();
  if (known.length !== ids.length) return json({ error: "Ada varian yang tidak dikenal." }, 400);

  await releaseExpired(db);

  // harga per pcs mengikuti ukuran (2XL/3XL lebih mahal), dihitung di server
  const priceById = Object.fromEntries(known.map((v) => [v.id, priceFor(v.size)]));
  const subtotal = ids.reduce((s, id) => s + qtyById[id] * priceById[id], 0);
  const uniqueCode = 1 + Math.floor(Math.random() * 299); // memudahkan mencocokkan transfer
  const total = subtotal + ship.cost + uniqueCode;
  const code = genCode();
  const now = Date.now();
  const expiresAt = now + CONFIG.payHours * 3600 * 1000;

  // Satu transaksi: potong stok (gagal jika jadi minus) + simpan pesanan
  const stmts = ids.map((id) =>
    db.prepare("UPDATE variants SET stock = stock - ? WHERE id = ?").bind(qtyById[id], id)
  );
  stmts.push(
    db.prepare(
      `INSERT INTO orders (code, name, phone, address, note, shipping_id, shipping_label, shipping_cost,
         subtotal, unique_code, total, status, created_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
    ).bind(code, name, phone, address, note, ship.id, ship.label, ship.cost, subtotal, uniqueCode, total, now, expiresAt)
  );
  for (const id of ids)
    stmts.push(
      db.prepare("INSERT INTO order_items (order_id, variant_id, qty, price) SELECT id, ?, ?, ? FROM orders WHERE code = ?")
        .bind(id, qtyById[id], priceById[id], code)
    );

  try {
    await db.batch(stmts);
  } catch (e) {
    if (isCheckError(e)) return json({ error: "Maaf, stok salah satu varian tidak cukup. Silakan cek ulang pilihan Anda." }, 409);
    throw e;
  }
  return json({ code, total, uniqueCode, expiresAt });
}
