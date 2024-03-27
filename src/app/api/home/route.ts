import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categories = searchParams.get("categories")?.split(",");
  const limit = searchParams.get("limit") as string;

  const data = await sql(
    "SELECT items.id AS item_id, items.categories as categories, array_unique(array_agg(color_value)) as colors, (CASE WHEN (SELECT SUM(quantity) FROM item_details WHERE item_id = items.id) > 0 THEN false ELSE true END) as out_of_stock, items.name AS item_name, items.description AS description, price, discount, users.name AS store_name, users.id AS store_id FROM items JOIN item_details ON item_details.item_id = items.id JOIN users ON users.id = items.store_id WHERE items.categories && $1 GROUP BY items.id, users.name, users.id LIMIT $2",
    [categories, limit],
  );

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
