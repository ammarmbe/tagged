import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const { nano_id, status, cancel_reason } = await req.json();

  const statuses = [
    "pending",
    "confirmed",
    "shipped",
    "completed",
    "store_cancelled",
    "customer_cancelled",
    "return_requested",
    "return_declined",
    "return_accepted",
    "returned",
  ];

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const current_status = await sql(
    "SELECT status FROM orders WHERE nano_id = $1 AND store_id = $2",
    [nano_id, user.id],
  );

  if (
    (status === "store_cancelled" && !cancel_reason) ||
    !statuses.includes(status) ||
    statuses.findIndex((s) => s === current_status[0]?.status) >=
      statuses.findIndex((s) => s === status)
  ) {
    console.log(status);
    return new Response(JSON.stringify(null), { status: 400 });
  }

  await sql(
    `UPDATE orders SET status = $1, ${status === "completed" ? "completed_at = now() at time zone 'Africa/Cairo', " : ""}cancel_reason = $2 WHERE nano_id = $3 AND store_id = $4`,
    [status, cancel_reason, nano_id, user.id],
  );

  if (
    (!["return_accepted", "returned"].includes(current_status[0]?.status) &&
      ["return_accepted", "returned"].includes(status)) ||
    status === "store_cancelled"
  ) {
    await sql(
      "UPDATE item_configs SET quantity = item_configs.quantity + 1 FROM order_items WHERE order_items.order_id = (SELECT id FROM orders WHERE nano_id = $1) AND item_configs.color = order_items.color AND item_configs.size = order_items.size AND item_configs.item_id = order_items.item_id",
      [nano_id],
    );
  }

  await sql(
    "INSERT INTO order_status_history (order_id, status) VALUES ((SELECT id FROM orders WHERE nano_id = $1), $2)",
    [nano_id, status],
  );

  return new Response("OK");
}
