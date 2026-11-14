// =============================================================
//  PENGATURAN TOKO — ubah bagian ini sesuai produk Anda
// =============================================================
export const CONFIG = {
  productName: "Croco Grandson",
  description: "Kaos ABG Siniar edisi Croco Grandson. 100% cotton. Ready stock, langsung kirim.",
  price: 189000,                     // harga dasar per pcs (Rupiah), ukuran S–XL
  sizeSurcharge: { "2XL": 15000, "3XL": 30000 },  // tambahan harga per ukuran
  images: { Putih: "/img/putih.jpg", Hitam: "/img/hitam.jpg" },
  sizeChart: {                        // satuan cm
    columns: ["Lebar", "Panjang", "Bahu", "Lengan", "Lingkar lengan"],
    rows: {
      S:     [51, 70, 48, 21, "17,5"],
      M:     [54, 73, 50, 22, "18,5"],
      L:     [57, 76, 52, 23, 19],
      XL:    [60, 79, 55, 24, "20,5"],
      "2XL": [63, 82, 60, 25, "21,5"],
      "3XL": [65, 85, 62, 26, 22],
    },
  },
  bank: { name: "BRI", number: "037601037217500", holder: "Andry Randy" },
  adminWa: "6281228582961",           // nomor WA admin (sementara, uji coba), format 62…
  shipping: [
    { id: "jabodetabek", label: "Jabodetabek", cost: 15000 },
    { id: "jawa",        label: "Pulau Jawa (luar Jabodetabek)", cost: 25000 },
    { id: "luar-jawa",   label: "Luar Pulau Jawa", cost: 45000 },
    { id: "ambil",       label: "Ambil sendiri (Bekasi)", cost: 0 },
  ],
  payHours: 24,          // batas waktu bayar; lewat dari ini order batal & stok kembali
  lowStock: 3,           // varian dengan stok ≤ angka ini ditandai "menipis"
  maxQtyPerVariant: 10,
};
// =============================================================

// Harga satu pcs untuk ukuran tertentu (harga dasar + tambahan ukuran besar)
export const priceFor = (size) => CONFIG.price + (CONFIG.sizeSurcharge[size] || 0);

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const isCheckError = (e) => /CHECK constraint/i.test(String(e?.message || e) + String(e?.cause?.message || ""));

export function normPhone(p) {
  let d = String(p || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return d.length >= 10 && d.length <= 15 ? d : "";
}

export function genCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const r = crypto.getRandomValues(new Uint8Array(6));
  return "KS-" + Array.from(r, (b) => a[b % a.length]).join("");
}

// Kembalikan stok sebuah order lalu ubah statusnya — dalam satu transaksi.
// Syarat status dicek di kedua statement, jadi aman walau dipanggil dua kali bersamaan.
export function restockAndSetStatus(db, orderId, newStatus, fromStatuses) {
  const list = fromStatuses.map((s) => `'${s}'`).join(","); // hanya konstanta internal
  return [
    db.prepare(
      `UPDATE variants SET stock = stock + (SELECT SUM(qty) FROM order_items WHERE order_id = ?1 AND variant_id = variants.id)
       WHERE id IN (SELECT variant_id FROM order_items WHERE order_id = ?1)
         AND EXISTS (SELECT 1 FROM orders WHERE id = ?1 AND status IN (${list}))`
    ).bind(orderId),
    db.prepare(`UPDATE orders SET status = ?2 WHERE id = ?1 AND status IN (${list})`).bind(orderId, newStatus),
  ];
}

// Order "pending" yang lewat batas waktu → expired, stok dikembalikan.
// Dipanggil setiap kali halaman toko / dashboard dibuka (tanpa perlu cron).
export async function releaseExpired(db) {
  const { results } = await db
    .prepare("SELECT id FROM orders WHERE status = 'pending' AND expires_at < ?")
    .bind(Date.now())
    .all();
  for (const o of results) await db.batch(restockAndSetStatus(db, o.id, "expired", ["pending"]));
}
