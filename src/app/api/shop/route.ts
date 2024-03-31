import sql from "@/utils/db";

export async function POST(req: Request) {
  const {
    name,
    store_nano_ids,
    price_min,
    price_max,
    sale,
    colors,
    id,
    in_stock,
    category,
    out_of_stock,
  } = await req.json();

  let query =
    "SELECT items.id AS item_id, items.nano_id, users.nano_id as store_nano_id, array_agg(DISTINCT color_hex) as colors, (SELECT url FROM item_images WHERE item_id = items.id LIMIT 1) AS image_url, (CASE WHEN (SELECT SUM(quantity) FROM item_configs WHERE item_id = items.id) > 0 THEN false ELSE true END) as out_of_stock, items.name AS item_name, items.description AS description, price, discount, users.name AS store_name, users.id AS store_id FROM items JOIN item_configs ON item_configs.item_id = items.id JOIN users ON users.id = items.store_id WHERE items.id > $1 AND items.deleted != true";
  const params = [id];

  if (name) {
    query += ` AND items.name % $${params.length + 1}`;
    params.push(name);
  }

  if (category) {
    query += ` AND $${params.length + 1} = ANY(items.category)`;
    params.push(category);
  }

  if (store_nano_ids) {
    query += ` AND users.nano_id = ANY($${params.length + 1})`;
    params.push(store_nano_ids);
  }

  if (price_min) {
    query += ` AND (items.price - COALESCE(items.discount, 0)) >= $${params.length + 1}`;
    params.push(price_min);
  }

  if (price_max) {
    query += ` AND (items.price - COALESCE(items.discount, 0)) <= $${params.length + 1}`;
    params.push(price_max);
  }

  if (sale) {
    query += " AND COALESCE(items.discount, 0) > 0";
  }

  if (colors) {
    query += ` AND item_configs.color % ANY($${params.length + 1})`;
    params.push(colors);
  }

  if (in_stock !== out_of_stock) {
    if (in_stock) {
      query += ` AND (CASE WHEN (SELECT SUM(quantity) FROM item_configs WHERE item_id = items.id) > 0 THEN false ELSE true END) = false`;
    }

    if (out_of_stock) {
      query += ` AND (CASE WHEN (SELECT SUM(quantity) FROM item_configs WHERE item_id = items.id) > 0 THEN false ELSE true END) = true`;
    }
  }

  query += ` GROUP BY items.id, users.name, users.id LIMIT 10`;

  const data = await sql(query, params);

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
