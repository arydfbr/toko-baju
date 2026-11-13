-- Skema database toko kaos (Cloudflare D1)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS variants;

-- 10 varian: 2 warna x 5 ukuran. CHECK menjamin stok tidak pernah minus,
-- sehingga dua pembeli tidak bisa membeli potongan terakhir yang sama.
CREATE TABLE variants (
  id    TEXT PRIMARY KEY,
  color TEXT NOT NULL,
  size  TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sort  INTEGER NOT NULL
);

CREATE TABLE orders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  code           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address        TEXT NOT NULL,
  note           TEXT,
  shipping_id    TEXT NOT NULL,
  shipping_label TEXT NOT NULL,
  shipping_cost  INTEGER NOT NULL,
  subtotal       INTEGER NOT NULL,
  unique_code    INTEGER NOT NULL,
  total          INTEGER NOT NULL,
  status         TEXT NOT NULL, -- pending | paid | shipped | expired | cancelled
  courier        TEXT,
  resi           TEXT,
  created_at     INTEGER NOT NULL,
  expires_at     INTEGER NOT NULL,
  paid_at        INTEGER,
  shipped_at     INTEGER
);
CREATE INDEX idx_orders_status ON orders(status, expires_at);

CREATE TABLE order_items (
  order_id   INTEGER NOT NULL REFERENCES orders(id),
  variant_id TEXT NOT NULL REFERENCES variants(id),
  qty        INTEGER NOT NULL,
  price      INTEGER NOT NULL
);
CREATE INDEX idx_items_order ON order_items(order_id);

-- Stok awal (ubah angkanya, atau atur nanti dari dashboard admin)
-- Harga per ukuran diatur di lib/shared.js (price + sizeSurcharge)
INSERT INTO variants (id, color, size, stock, sort) VALUES
  ('putih-s',   'Putih', 'S',   10, 1),
  ('putih-m',   'Putih', 'M',   10, 2),
  ('putih-l',   'Putih', 'L',   10, 3),
  ('putih-xl',  'Putih', 'XL',  10, 4),
  ('putih-2xl', 'Putih', '2XL', 10, 5),
  ('putih-3xl', 'Putih', '3XL', 10, 6),
  ('hitam-s',   'Hitam', 'S',   10, 7),
  ('hitam-m',   'Hitam', 'M',   10, 8),
  ('hitam-l',   'Hitam', 'L',   10, 9),
  ('hitam-xl',  'Hitam', 'XL',  10, 10),
  ('hitam-2xl', 'Hitam', '2XL', 10, 11),
  ('hitam-3xl', 'Hitam', '3XL', 10, 12);
