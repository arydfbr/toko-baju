import { CONFIG, json, releaseExpired, priceFor } from "../../lib/shared.js";

// GET /api/store — info produk + stok terkini
export async function onRequestGet({ env }) {
  await releaseExpired(env.DB);
  const { results } = await env.DB.prepare("SELECT id, color, size, stock FROM variants ORDER BY sort").all();
  return json({ config: CONFIG, variants: results.map((v) => ({ ...v, price: priceFor(v.size) })) });
}
