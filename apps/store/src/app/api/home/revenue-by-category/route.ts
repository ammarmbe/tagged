import { timeConstraint } from "@/utils";
import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range =
    (searchParams.get("range") as "day" | "week" | "month" | "year" | "all") ||
    "day";

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  const data = await sql(
    `SELECT category, COALESCE(SUM((order_items.price - order_items.discount) * order_items.quantity), 0) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id LEFT JOIN items ON items.id = order_items.item_id WHERE orders.store_id = $1 AND orders.status = 'completed' AND ${timeConstraint(
      range,
      "orders",
      "completed_at",
    )} GROUP BY category`,
    [user.id],
  );

  return new Response(JSON.stringify(data));
}
