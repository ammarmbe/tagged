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
    "SELECT items.name item_name, cart_items.id as id, users.name as store_name, users.id as store_id, items.id as item_id, items.price, COALESCE(items.discount, 0) as discount, cart_items.quantity as quantity, item_details.size as size, item_details.color as color FROM cart_items JOIN items ON items.id = cart_items.item_id JOIN users ON users.id = items.store_id JOIN item_details ON item_details.id = cart_items.item_detail_id WHERE user_id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}

export async function POST(req: Request) {
  const { id, color, size, quantity: cartQuantity, type } = await req.json();
  const { user } = await getUser();

  const { quantity } = (
    await sql(
      "SELECT quantity FROM item_details WHERE item_id = $1 AND color = $2 AND size = $3",
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
    `INSERT INTO cart_items (user_id, item_id, item_detail_id, quantity) VALUES ($1, $2, (SELECT id FROM item_details WHERE color = $3 AND size = $4 AND item_id = $2), $5) ON CONFLICT (user_id, item_detail_id) DO UPDATE SET quantity = ${type === "add" ? "cart_items.quantity + " : ""}$5::int`,
    [user?.id, id, color, size, cartQuantity],
  );

  return new Response("OK", {
    status: 200,
  });
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

  return new Response("OK", {
    status: 200,
  });
}
