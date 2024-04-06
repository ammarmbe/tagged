import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  const { user } = await getUser();

  const [order] = await sql(
    "SELECT status FROM orders WHERE id = $1 AND user_id = $2",
    [orderId, user?.id],
  );

  if (order?.status !== "pending") return new Response(null, { status: 400 });

  await sql(
    "UPDATE orders SET status = 'customer_cancelled' WHERE id = $1 AND user_id = $2",
    [orderId, user?.id],
  );

  await sql(
    "UPDATE item_configs SET quantity = item_configs.quantity + 1 FROM order_items WHERE order_items.order_id = $1 AND item_configs.color = order_items.color AND item_configs.size = order_items.size AND item_configs.item_id = order_items.item_id",
    [orderId],
  );

  await sql(
    "INSERT INTO order_status_history (order_id, status) VALUES ((SELECT id FROM orders WHERE nano_id = $1), 'customer_cancelled')",
    [orderId],
  );

  return new Response("OK");
}
