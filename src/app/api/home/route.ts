import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category")?.split(",");
  const limit = searchParams.get("limit") as string;

  const data = await sql(
    "SELECT items.id AS item_id, items.nano_id, (SELECT url FROM item_images WHERE item_id = items.id ORDER BY thumbnail LIMIT 1) AS image_url, users.nano_id AS store_nano_id, items.category as category, array_agg(DISTINCT color_hex) as colors, (CASE WHEN (SELECT SUM(quantity) FROM item_configs WHERE item_id = items.id) > 0 THEN false ELSE true END) as out_of_stock, items.name AS item_name, items.description AS description, price, discount, users.name AS store_name, users.id AS store_id FROM items JOIN item_configs ON item_configs.item_id = items.id JOIN users ON users.id = items.store_id WHERE items.category && $1 GROUP BY items.id, users.name, users.id LIMIT $2",
    [category, limit],
  );

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
