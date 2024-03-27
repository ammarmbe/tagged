import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 9);

export async function POST(req: Request) {
  const nano_id =
    String(new Date().getDate()).padStart(2, "0") +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    new Date().getFullYear().toString().slice(-2) +
    "-" +
    nanoid();

  const {
    street,
    apartment,
    city,
    governorate,
    number,
    first_name,
    last_name,
  } = await req.json();

  const { user } = await getUser();

  if (!street || !city || !governorate || !number || !user) {
    return new Response(null, { status: 400 });
  }

  let cart_items = await sql(
    "SELECT store_id, cart_items.item_id, item_details.size, item_details.color, cart_items.quantity FROM cart_items JOIN items ON items.id = cart_items.item_id JOIN item_details ON item_details.id = cart_items.item_detail_id WHERE cart_items.user_id = $1",
    [user.id],
  );

  const res = await sql(
    "SELECT $2 = ANY(allowed_gov) as gov_allowed FROM store_settings WHERE store_id IN ($1)",
    [cart_items.map((item) => item.store_id).join(","), governorate],
  );

  for (const item of res) {
    if (!item.gov_allowed) {
      cart_items = cart_items.filter(
        (cart_item) => cart_item.store_id !== item.store_id,
      );
    }
  }

  if (cart_items.length === 0) {
    return new Response(null, { status: 400 });
  }

  const unique_store_ids = Array.from(
    new Set(cart_items.map((item) => item.store_id)),
  );

  for (const store_id of unique_store_ids) {
    const items = cart_items.filter((item) => item.store_id === store_id);

    const order_id = await sql(
      "INSERT INTO orders (nano_id, first_name, last_name, user_id, store_id, street, apartment, city, governorate, phone_number, shipping_price, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, (SELECT coalesce((SELECT shipping_price FROM store_settings WHERE store_id = $5), 0)), 'pending') RETURNING id",
      [
        nano_id,
        first_name,
        last_name,
        user.id,
        store_id,
        street,
        apartment,
        city,
        governorate,
        number.startsWith("1") ? "0" + number : number,
      ],
    );

    for (const item of items) {
      await sql(
        "INSERT INTO order_items (order_id, item_id, quantity, size, color, name, description, price, discount) VALUES ($1, $2, $3, $4, $5, (SELECT name FROM items WHERE id = $2), (SELECT description FROM items WHERE id = $2), (SELECT price FROM items WHERE id = $2), (SELECT COALESCE(discount,0) FROM items WHERE id = $2))",
        [order_id[0].id, item.item_id, item.quantity, item.size, item.color],
      );
    }

    await sql(
      "INSERT INTO notifications (order_id, store_id, type) VALUES ($1, $2, 'new-order')",
      [order_id[0].id, store_id],
    );
  }

  await sql("DELETE FROM cart_items WHERE user_id = $1", [user.id]);
  return new Response(nano_id, { status: 200 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const nano_id = searchParams.get("nano_id");

  const { user } = await getUser();

  if (!user || (!id && !nano_id)) {
    return new Response("Not signed in or no id.", { status: 401 });
  }

  const data = await sql(
    "SELECT orders.created_at, orders.nano_id, orders.reason, orders.shipping_price, orders.status, orders.governorate, orders.id as id, orders.first_name || ' ' || orders.last_name as customer_name, street, apartment, city, phone_number, orders.id as id, users.name as store_name, (SELECT SUM((order_items.price - COALESCE(order_items.discount, 0)) * order_items.quantity) FROM order_items WHERE order_items.order_id = orders.id) as total FROM orders JOIN order_items ON order_items.order_id = orders.id JOIN users ON users.id = orders.user_id WHERE user_id = $1 AND (orders.id = $2 OR orders.nano_id = $3) GROUP BY orders.id, users.name",
    [user.id, id, nano_id],
  );

  return new Response(JSON.stringify(data[0]), {
    headers: { "content-type": "application/json" },
  });
}
