import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in", {
      status: 401,
    });
  }

  const data = await sql(
    "SELECT items.name as item_name, items.nano_id, (SELECT url FROM item_images WHERE item_id = items.id ORDER BY thumbnail DESC NULLS LAST LIMIT 1) AS image_url, users.nano_id as store_nano_id, cart_items.id as id, users.name as store_name, users.id as store_id, items.id as item_id, items.price, COALESCE(items.discount, 0) as discount, cart_items.quantity as quantity, item_configs.size as size, item_configs.color as color FROM cart_items JOIN items ON items.id = cart_items.item_id JOIN users ON users.id = items.store_id JOIN item_configs ON item_configs.id = cart_items.item_config_id WHERE user_id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const { id, color, size, quantity: cartQuantity, type } = await req.json();
  const { user } = await getUser();

  const { quantity } = (
    await sql(
      "SELECT quantity FROM item_configs WHERE item_id = $1 AND color = $2 AND size = $3",
      [id, color, size],
    )
  )[0];

  if (!quantity) {
    return new Response("Out of stock", {});
  }

  if (!user) {
    return new Response("Not allowed", {
      status: 400,
    });
  }

  await sql(
    `INSERT INTO cart_items (user_id, item_id, item_config_id, quantity) VALUES ($1, $2, (SELECT id FROM item_configs WHERE color = $3 AND size = $4 AND item_id = $2), $5) ON CONFLICT (user_id, item_config_id) DO UPDATE SET quantity = ${type === "add" ? "cart_items.quantity + " : ""}$5::int`,
    [user?.id, id, color, size, cartQuantity],
  );

  return new Response("OK");
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in", {
      status: 401,
    });
  }

  await sql("DELETE FROM cart_items WHERE id = $1", [id]);

  return new Response("OK");
}
