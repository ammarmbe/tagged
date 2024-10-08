import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in.", { status: 401 });
  }

  const data = await sql(
    "SELECT order_items.*, (SELECT url FROM item_images WHERE item_id = items.id ORDER BY thumbnail DESC NULLS LAST LIMIT 1) AS image_url, items.nano_id FROM order_items LEFT JOIN items ON items.id = order_items.item_id WHERE order_id = $1",
    [orderId],
  );

  return new Response(JSON.stringify(data));
}
