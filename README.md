# Toko Kaos — sistem jualan semi otomatis

Cloudflare Pages + D1. Ready stock, 2 warna (Putih/Hitam) × 6 ukuran (S–3XL). Harga Rp189.000; 2XL +Rp15.000, 3XL +Rp30.000, pembayaran transfer manual.

## Yang otomatis vs yang Anda kerjakan

| Otomatis | Anda |
|---|---|
| Stok tampil real-time, ukuran habis tidak bisa dipilih | Cek mutasi rekening |
| Stok dikunci saat checkout (tidak bisa oversell) | Klik **Tandai lunas** |
| Total + **kode unik** (mis. Rp465.**053**) agar transfer mudah dicocokkan | Kemas & kirim paket |
| Order tak dibayar dalam 24 jam → batal, stok kembali | Isi kurir + resi |
| Pesan WhatsApp sudah terisi (tagihan, konfirmasi lunas, resi) — tinggal tekan kirim | Restock |
| Peringatan stok menipis + rekap varian terlaris | |

## Struktur

```
public/index.html          halaman toko + halaman pembayaran/status (?order=KODE)
public/admin.html          dashboard admin
public/img/putih.jpg       foto produk (tambahkan sendiri)
public/img/hitam.jpg
functions/api/...          API (Pages Functions)
lib/shared.js              ← PENGATURAN TOKO: nama, harga dasar, tambahan harga per ukuran (`sizeSurcharge`), rekening, WA, ongkir
schema.sql                 tabel database + stok awal
wrangler.toml
```

## Cara pasang (lewat GitHub, tanpa terminal)

1. Ubah pengaturan di `lib/shared.js`: nama produk, harga, rekening bank, nomor WA admin, ongkir. Foto produk: `public/img/putih.jpg` dan `public/img/hitam.jpg`.
2. **Database:** Cloudflare › Storage & Databases › D1 › Create database `toko-kaos-db`. Buka **Console**, tempel isi `schema.sql`, jalankan.
3. **Pages:** Workers & Pages › Create › Pages › Connect to Git › pilih repository ini. Framework preset **None**, build command **kosong**, build output directory **public**.
4. **Binding:** project Pages › Settings › Bindings › Add › D1 database: nama variabel `DB`, pilih `toko-kaos-db`. Settings › Variables and Secrets › tambah secret `ADMIN_PASSWORD`.
5. **Deploy ulang:** Deployments › Retry deployment. Buka `https://<project>.pages.dev` (toko) dan `/admin.html` (admin).
6. Opsional: Custom domains › tambah subdomain, misalnya `merch.abgsiniar.id`.

Setiap perubahan yang di-commit ke repository ini otomatis di-deploy ulang oleh Cloudflare.

Database lama dengan ukuran S–XXL? Jalankan `migrasi-ukuran-2xl-3xl.sql` di Console D1.

Deploy lewat terminal: lihat `wrangler.toml.example`.

## Rutinitas harian

1. Buka admin → tab **Belum bayar**.
2. Cek mutasi rekening; ketik nominalnya di kotak cari (kode unik membuatnya langsung ketemu) → **Tandai lunas** → WhatsApp konfirmasi terbuka, tekan kirim.
3. Tab **Siap kirim** → **Salin alamat** → buat resi di aplikasi kurir → isi kurir + resi → **Kirim** → WhatsApp resi terbuka, tekan kirim.
4. Sesekali cek tab **Stok** dan **Penjualan**.

Kalau pembeli transfer setelah batas waktu, buka tab **Batal/Kedaluwarsa** → **Ternyata sudah bayar**. Stok dipotong lagi selama masih ada; kalau sudah habis, sistem memberi tahu agar Anda menawarkan ganti varian atau refund.

## Pengembangan berikutnya (opsional)

- **QRIS otomatis** (Midtrans/Xendit): tambahkan endpoint webhook yang memanggil aksi `paid`.
- **Ongkir otomatis**: ganti daftar `shipping` dengan panggilan API Biteship/RajaOngkir di `checkout.js`.
- **Upload bukti transfer**: simpan ke Cloudflare R2.
- **Tambah ukuran/warna**: tambah baris di tabel `variants` dan warna di `COLOR_HEX` (index.html).
