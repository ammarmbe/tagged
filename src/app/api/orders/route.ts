import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in.", { status: 401 });
  }

  const data = await sql(
    "SELECT orders.created_at, orders.nano_id, orders.shipping_price, orders.status, orders.governorate, orders.id AS id, orders.reason, orders.first_name || ' ' || orders.last_name AS customer_name, street AS street, apartment AS apartment, city AS city, phone_number AS phone_number, orders.id AS id, users.name AS store_name, (SELECT SUM((order_items.price - COALESCE(order_items.discount, 0)) * order_items.quantity)) AS total FROM orders JOIN order_items ON order_items.order_id = orders.id JOIN users ON users.id = orders.store_id WHERE user_id = $1 GROUP BY orders.id, users.name",
    [user.id],
  );

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request) {
  const {
    id,
    governorate = null,
    status = null,
    totalMin = null,
    totalMax = null,
    shippingMin = null,
    shippingMax = null,
    createdMin = null,
    createdMax = null,
  } = await request.json();

  const { user } = await getUser();

  if (typeof id !== "number" || !user) {
    return new Response("Not signed in.", { status: 401 });
  }

  let query =
    "SELECT orders.created_at, orders.nano_id, orders.shipping_price, orders.status, orders.governorate, orders.id as id, (CASE WHEN orders.status = 'pending' OR orders.status = 'cancelled' OR orders.status = 'delivered' THEN orders.first_name ELSE orders.first_name || ' ' || orders.last_name END) as customer_name, (CASE WHEN orders.status = 'pending' OR orders.status = 'cancelled' OR orders.status = 'delivered' THEN true ELSE false END) as address_hidden, (CASE WHEN orders.status = 'pending' OR orders.status = 'cancelled' OR orders.status = 'delivered' THEN null ELSE street END) as street, (CASE WHEN orders.status = 'pending' OR orders.status = 'cancelled' OR orders.status = 'delivered' THEN null ELSE apartment END) as apartment, (CASE WHEN orders.status = 'pending' OR orders.status = 'cancelled' OR orders.status = 'delivered' THEN null ELSE city END) as city, (CASE WHEN orders.status = 'pending' OR orders.status = 'cancelled' OR orders.status = 'delivered' THEN null ELSE phone_number END) as phone_number, orders.id as id, users.name as store_name, (SELECT SUM((order_items.price - COALESCE(order_items.discount, 0)) * order_items.quantity)) as total FROM orders JOIN order_items ON order_items.order_id = orders.id JOIN users ON users.id = orders.user_id WHERE orders.id > $1 AND store_id = $2 ";
  const params = [id, user.id];

  if (governorate) {
    query += `AND governorate = $${params.length + 1} `;
    params.push(governorate);
  }

  if (status) {
    query += `AND status = ANY($${params.length + 1}) `;
    params.push(status);
  }

  if (totalMin) {
    query += `AND (SELECT SUM((order_items.price - COALESCE(order_items.discount, 0)) * order_items.quantity)) >= $${params.length + 1} `;
    params.push(totalMin);
  }

  if (totalMax) {
    query += `AND (SELECT SUM((order_items.price - COALESCE(order_items.discount, 0)) * order_items.quantity)) <= $${params.length + 1} `;
    params.push(totalMax);
  }

  if (shippingMin) {
    query += `AND shipping_price >= $${params.length + 1} `;
    params.push(shippingMin);
  }

  if (shippingMax) {
    query += `AND shipping_price <= $${params.length + 1} `;
    params.push(shippingMax);
  }

  if (createdMin) {
    query += `AND created_at >= $${params.length + 1} `;
    params.push(createdMin);
  }

  if (createdMax) {
    query += `AND created_at <= $${params.length + 1} `;
    params.push(createdMax);
  }

  query += "GROUP BY orders.id, users.name";

  const data = await sql(query, params);

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
