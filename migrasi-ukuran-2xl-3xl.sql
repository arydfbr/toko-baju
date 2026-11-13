-- Jalankan HANYA jika database D1 sudah terlanjur dibuat dengan schema lama (ukuran S–XXL).
-- Database baru cukup memakai schema.sql. Data pesanan yang sudah ada tetap aman.

-- 1. XXL berganti nama menjadi 2XL (id varian tetap, jadi pesanan lama tidak terputus)
UPDATE variants SET size = '2XL' WHERE size = 'XXL';

-- 2. Tambah ukuran 3XL (stok awal 0; isi lewat tab Stok di dashboard admin)
INSERT OR IGNORE INTO variants (id, color, size, stock, sort) VALUES
  ('putih-3xl', 'Putih', '3XL', 0, 6),
  ('hitam-3xl', 'Hitam', '3XL', 0, 12);

-- 3. Rapikan urutan tampil
UPDATE variants SET sort = 7  WHERE id = 'hitam-s';
UPDATE variants SET sort = 8  WHERE id = 'hitam-m';
UPDATE variants SET sort = 9  WHERE id = 'hitam-l';
UPDATE variants SET sort = 10 WHERE id = 'hitam-xl';
UPDATE variants SET sort = 11 WHERE id = 'hitam-xxl';
