import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  const data = await sql(
    "SELECT 'orders_pending' AS type, COUNT(orders.*) AS count FROM orders WHERE status = 'pending' AND store_id = $1 UNION select 'return_requests' AS type, COUNT(orders.*) AS count FROM orders WHERE status = 'return_requested' AND store_id = $1 UNION SELECT 'new_notifications' AS type, COUNT(notifications.*) AS count FROM notifications WHERE store_id = $1 AND read = false",
    [user.id],
  );

  return new Response(
    JSON.stringify({
      orders_pending: data.find((d) => d.type === "orders_pending")?.count || 0,
      return_requests:
        data.find((d) => d.type === "return_requests")?.count || 0,
      new_notifications:
        data.find((d) => d.type === "new_notifications")?.count || 0,
    }),
  );
}
