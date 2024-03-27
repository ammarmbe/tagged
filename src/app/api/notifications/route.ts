import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tab =
    (searchParams.get("tab") as "all" | "unread" | "new-orders") || "all";

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const data = await sql(
    `SELECT notifications.id, orders.nano_id AS order_nano_id, orders.governorate AS order_governorate, orders.first_name AS customer_name, SUM((order_items.price - order_items.discount) * order_items.quantity) AS order_total, type, message, read, notifications.created_at FROM notifications LEFT JOIN orders ON orders.id = notifications.order_id LEFT JOIN order_items ON order_items.order_id = orders.id WHERE notifications.store_id = $1 ${tab === "new-orders" ? "AND type = 'new-order' " : tab === "unread" ? "AND read = false " : ""}GROUP BY notifications.id, orders.nano_id, orders.governorate, orders.first_name, type, message, read, notifications.created_at ORDER BY notifications.created_at DESC LIMIT 10`,
    [user.id],
  );

  console.log(data);

  return new Response(JSON.stringify(data));
}
