import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  const data = await sql(
    "SELECT order_items.*, (SELECT nano_id FROM items WHERE items.id = order_items.item_id) AS nano_id FROM order_items JOIN orders ON order_items.order_id = orders.id WHERE orders.nano_id = $1 AND orders.store_id = $2",
    [nano_id, user.id]
  );

  return new Response(JSON.stringify(data));
}
