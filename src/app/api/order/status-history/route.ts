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
    "SELECT orders.created_at, order_status_history.created_at as date, order_status_history.status FROM orders LEFT JOIN order_status_history ON order_status_history.order_id = orders.id WHERE orders.nano_id = $1 AND orders.store_id = $2 ORDER BY date DESC",
    [nano_id, user.id],
  );

  return new Response(JSON.stringify(data));
}
