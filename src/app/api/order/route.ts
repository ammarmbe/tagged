import { sendNewOrderEmail } from "@/utils/sendNewOrderEmail";
import { sendNewOrderEmailToStore } from "@/utils/sendNewOrderEmailToStore";
import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

export async function POST(req: Request) {
  const nano_id = nanoid();

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
    "SELECT store_id, cart_items.item_id, item_configs.size, item_configs.color, cart_items.quantity FROM cart_items JOIN items ON items.id = cart_items.item_id JOIN item_configs ON item_configs.id = cart_items.item_config_id WHERE cart_items.user_id = $1",
    [user.id],
  );

  const res = await sql(
    "SELECT $2 IN (SELECT jsonb_array_elements_text(feature_flags -> 'allowed_gov')) as gov_allowed FROM users WHERE id IN ($1)",
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
      "INSERT INTO orders (nano_id, address, first_name, user_id, store_id, governorate, shipping_price, status) VALUES ($1, ROW($2, $3, $4, $5, $6), $7, $8, $9, $10, (SELECT coalesce((SELECT feature_flags ->> 'shipping_price' FROM users WHERE id = $9), '0'))::int, 'pending') RETURNING id",
      [
        nano_id,
        street,
        apartment,
        city,
        number.startsWith("1") ? "0" + number : number,
        last_name,
        first_name,
        user.id,
        store_id,
        governorate,
      ],
    );

    for (const item of items) {
      await sql(
        "INSERT INTO order_items (order_id, item_id, quantity, size, color, name, price, discount) VALUES ($1, $2, $3, $4, $5, (SELECT name FROM items WHERE id = $2), (SELECT price FROM items WHERE id = $2), (SELECT COALESCE(discount, 0) FROM items WHERE id = $2))",
        [order_id[0].id, item.item_id, item.quantity, item.size, item.color],
      );

      await sql(
        "UPDATE item_configs SET quantity = quantity - $1 WHERE item_id = $2 AND size = $3 AND color = $4",
        [item.quantity, item.item_id, item.size, item.color],
      );
    }

    await sql(
      "INSERT INTO notifications (order_id, store_id, type) VALUES ($1, $2, 'new-order')",
      [order_id[0].id, store_id],
    );

    await sendNewOrderEmail(order_id[0].id.toString(), user.email);
    await sendNewOrderEmailToStore(
      order_id[0].id.toString(),
      (await sql("SELECT email FROM users WHERE id = $1", [store_id]))[0].email,
    );
  }

  await sql("DELETE FROM cart_items WHERE user_id = $1", [user.id]);

  return new Response(nano_id);
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
    "SELECT orders.created_at, orders.nano_id, orders.cancel_reason, orders.shipping_price, orders.status, orders.governorate, orders.first_name || ' ' || (orders.address).last_name as customer_name, (orders.address).street, (orders.address).apartment, (orders.address).city, (orders.address).phone_number, orders.id as id, users.name as store_name, (SELECT SUM((order_items.price - order_items.discount) * order_items.quantity) FROM order_items WHERE order_items.order_id = orders.id) as total FROM orders JOIN order_items ON order_items.order_id = orders.id JOIN users ON users.id = orders.store_id WHERE user_id = $1 AND (orders.id = $2 OR orders.nano_id = $3) GROUP BY orders.id, users.name",
    [user.id, id, nano_id],
  );

  return new Response(JSON.stringify(data[0]));
}
