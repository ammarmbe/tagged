import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term");

  const data = await sql(
    "SELECT items.nano_id AS item_nano_id, items.deleted, items.name AS item_name, items.price AS price, (SELECT url FROM item_images WHERE item_id = items.id ORDER BY thumbnail DESC NULLS LAST LIMIT 1) AS image_url, users.name AS store_name, users.nano_id AS store_nano_id FROM items JOIN users ON users.id = items.store_id WHERE (items.name % $1 OR $1 % ANY(items.category) OR users.name % $1) AND deleted != true",
    [term],
  );

  return new Response(JSON.stringify(data));
}
