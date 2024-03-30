import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in.", { status: 401 });
  }

  const data = await sql(
    "SELECT orders.created_at, orders.nano_id, orders.shipping_price, orders.status, orders.governorate, orders.id AS id, orders.cancel_reason, orders.first_name || ' ' || (orders.address).last_name AS customer_name, (orders.address).street AS street, (orders.address).apartment AS apartment, (orders.address).city AS city, (orders.address).phone_number AS phone_number, orders.id AS id, users.name AS store_name, (SELECT SUM((order_items.price - COALESCE(order_items.discount, 0)) * order_items.quantity)) AS total FROM orders JOIN order_items ON order_items.order_id = orders.id JOIN users ON users.id = orders.store_id WHERE user_id = $1 GROUP BY orders.id, users.name",
    [user.id],
  );

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
