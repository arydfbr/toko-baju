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
  // Ongkir J&T EZ 1 kg dari Tambun Selatan, dicek 17 Nov 2026 lewat Biteship.
  // `tbd: true` = ongkir belum diketahui, dikonfirmasi admin lewat WhatsApp sebelum pembeli transfer.
  shipping: [
    { id: "cek-admin", label: "Belum ada, nanti dicek admin pas bayar", cost: 0, tbd: true },
    { id: "jakarta-pusat", label: "Jakarta Pusat", cost: 9000, group: "Jabodetabek" },
    { id: "jakarta-selatan", label: "Jakarta Selatan", cost: 9000, group: "Jabodetabek" },
    { id: "jakarta-timur", label: "Jakarta Timur", cost: 9000, group: "Jabodetabek" },
    { id: "jakarta-barat", label: "Jakarta Barat", cost: 9000, group: "Jabodetabek" },
    { id: "jakarta-utara", label: "Jakarta Utara", cost: 9000, group: "Jabodetabek" },
    { id: "kota-bekasi", label: "Kota Bekasi", cost: 8000, group: "Jabodetabek" },
    { id: "kab-bekasi", label: "Kab. Bekasi", cost: 8000, group: "Jabodetabek" },
    { id: "kota-depok", label: "Kota Depok", cost: 9000, group: "Jabodetabek" },
    { id: "kota-bogor", label: "Kota Bogor", cost: 9000, group: "Jabodetabek" },
    { id: "kab-bogor", label: "Kab. Bogor", cost: 9000, group: "Jabodetabek" },
    { id: "kota-tangerang", label: "Kota Tangerang", cost: 9000, group: "Jabodetabek" },
    { id: "kota-tangerang-selatan", label: "Kota Tangerang Selatan", cost: 9000, group: "Jabodetabek" },
    { id: "kab-tangerang", label: "Kab. Tangerang", cost: 9000, group: "Jabodetabek" },
    { id: "kota-bandung", label: "Kota Bandung", cost: 11000, group: "Jawa Barat" },
    { id: "kab-bandung", label: "Kab. Bandung", cost: 11000, group: "Jawa Barat" },
    { id: "kota-cimahi", label: "Kota Cimahi", cost: 10000, group: "Jawa Barat" },
    { id: "kota-cirebon", label: "Kota Cirebon", cost: 10000, group: "Jawa Barat" },
    { id: "kab-karawang", label: "Kab. Karawang", cost: 11000, group: "Jawa Barat" },
    { id: "kota-tasikmalaya", label: "Kota Tasikmalaya", cost: 11000, group: "Jawa Barat" },
    { id: "kota-sukabumi", label: "Kota Sukabumi", cost: 12000, group: "Jawa Barat" },
    { id: "kab-purwakarta", label: "Kab. Purwakarta", cost: 12000, group: "Jawa Barat" },
    { id: "kab-cianjur", label: "Kab. Cianjur", cost: 14000, group: "Jawa Barat" },
    { id: "kab-subang", label: "Kab. Subang", cost: 14000, group: "Jawa Barat" },
    { id: "kab-sumedang", label: "Kab. Sumedang", cost: 15000, group: "Jawa Barat" },
    { id: "kab-indramayu", label: "Kab. Indramayu", cost: 15000, group: "Jawa Barat" },
    { id: "kab-garut", label: "Kab. Garut", cost: 17000, group: "Jawa Barat" },
    { id: "kota-tegal", label: "Kota Tegal", cost: 15000, group: "Jawa Tengah" },
    { id: "kota-semarang", label: "Kota Semarang", cost: 17000, group: "Jawa Tengah" },
    { id: "kota-surakarta-solo", label: "Kota Surakarta (Solo)", cost: 17000, group: "Jawa Tengah" },
    { id: "kab-banyumas-purwokerto", label: "Kab. Banyumas (Purwokerto)", cost: 17000, group: "Jawa Tengah" },
    { id: "kota-magelang", label: "Kota Magelang", cost: 19000, group: "Jawa Tengah" },
    { id: "kota-salatiga", label: "Kota Salatiga", cost: 20000, group: "Jawa Tengah" },
    { id: "kab-cilacap", label: "Kab. Cilacap", cost: 20000, group: "Jawa Tengah" },
    { id: "kab-kudus", label: "Kab. Kudus", cost: 20000, group: "Jawa Tengah" },
    { id: "kota-pekalongan", label: "Kota Pekalongan", cost: 21000, group: "Jawa Tengah" },
    { id: "kab-pati", label: "Kab. Pati", cost: 23000, group: "Jawa Tengah" },
    { id: "kab-jepara", label: "Kab. Jepara", cost: 23000, group: "Jawa Tengah" },
    { id: "kab-klaten", label: "Kab. Klaten", cost: 24000, group: "Jawa Tengah" },
    { id: "kota-surabaya", label: "Kota Surabaya", cost: 18000, group: "Jawa Timur" },
    { id: "kab-sidoarjo", label: "Kab. Sidoarjo", cost: 18000, group: "Jawa Timur" },
    { id: "kota-malang", label: "Kota Malang", cost: 21000, group: "Jawa Timur" },
    { id: "kota-kediri", label: "Kota Kediri", cost: 21000, group: "Jawa Timur" },
    { id: "kota-madiun", label: "Kota Madiun", cost: 21000, group: "Jawa Timur" },
    { id: "kota-mojokerto", label: "Kota Mojokerto", cost: 21000, group: "Jawa Timur" },
    { id: "kota-probolinggo", label: "Kota Probolinggo", cost: 21000, group: "Jawa Timur" },
    { id: "kota-pasuruan", label: "Kota Pasuruan", cost: 22000, group: "Jawa Timur" },
    { id: "kab-gresik", label: "Kab. Gresik", cost: 23000, group: "Jawa Timur" },
    { id: "kab-tulungagung", label: "Kab. Tulungagung", cost: 23000, group: "Jawa Timur" },
    { id: "kota-blitar", label: "Kota Blitar", cost: 25000, group: "Jawa Timur" },
    { id: "kab-jember", label: "Kab. Jember", cost: 25000, group: "Jawa Timur" },
    { id: "kab-banyuwangi", label: "Kab. Banyuwangi", cost: 26000, group: "Jawa Timur" },
    { id: "kab-jombang", label: "Kab. Jombang", cost: 26000, group: "Jawa Timur" },
    { id: "kota-batu", label: "Kota Batu", cost: 28000, group: "Jawa Timur" },
    { id: "ambil", label: "Ambil sendiri (Bekasi)", cost: 0 },
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
