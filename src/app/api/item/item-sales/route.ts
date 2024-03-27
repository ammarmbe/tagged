import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const { user } = await getUser();
  const { nano_id, orderBy, pageParam } = await req.json();

  if (!user?.id) {
    return new Response(null, { status: 401 });
  }

  const id = (
    await sql("SELECT id FROM items WHERE nano_id = $1 AND store_id = $2", [
      nano_id,
      user.id,
    ])
  )[0];

  const data = await sql(
    `SELECT (SELECT COUNT(*) FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE order_items.item_id = $1 AND order_items.id > $2) AS total_count, orders.created_at, orders.nano_id as order_id, orders.status, order_items.price AS price, order_items.discount AS discount, order_items.color AS color, order_items.size AS size FROM orders JOIN order_items ON orders.id = order_items.order_id WHERE order_items.item_id = $1 AND order_items.id > $2 ORDER BY $3 LIMIT 10`,
    [id?.id, pageParam, orderBy],
  );

  return new Response(JSON.stringify(data));
}
