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
    "SELECT items.name as item_name, items.nano_id, users.name as store_name, users.id as store_id, cart_items.id as id, items.id as item_id, items.price, COALESCE(items.discount, 0) as discount, cart_items.quantity as quantity, item_details.size as size, (SELECT allowed_gov FROM store_settings WHERE store_id = items.store_id) as allowed_gov, (SELECT shipping_price FROM store_settings WHERE store_id = items.store_id) as shipping_price, item_details.color as color FROM cart_items JOIN items ON items.id = cart_items.item_id JOIN users ON users.id = items.store_id JOIN item_details ON item_details.id = cart_items.item_detail_id WHERE user_id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
