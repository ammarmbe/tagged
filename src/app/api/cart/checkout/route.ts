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
    "SELECT items.name as item_name, items.nano_id, (SELECT url FROM item_images WHERE item_id = items.id ORDER BY thumbnail DESC NULLS LAST LIMIT 1) AS image_url, users.nano_id as store_nano_id, users.nano_id as store_nano_id, users.name as store_name, users.id as store_id, cart_items.id as id, items.id as item_id, items.price, COALESCE(items.discount, 0) as discount, cart_items.quantity as quantity, item_configs.size as size, (SELECT jsonb_array_elements_text(feature_flags -> 'allowed_gov') FROM users WHERE id = items.store_id) as allowed_gov, (SELECT feature_flags ->> 'shipping_price' FROM users WHERE id = items.store_id) as shipping_price, item_configs.color as color FROM cart_items JOIN items ON items.id = cart_items.item_id JOIN users ON users.id = items.store_id JOIN item_configs ON item_configs.id = cart_items.item_config_id WHERE user_id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
