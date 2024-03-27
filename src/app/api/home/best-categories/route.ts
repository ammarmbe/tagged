import { timeConstraint } from "@/utils";
import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") || "day") as
    | "day"
    | "week"
    | "month"
    | "year"
    | "all";

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const data = await sql(
    `SELECT items.categories[array_upper(items.categories, 1)] as category_name, SUM((COALESCE(order_items.price, 0) - COALESCE(order_items.discount, 0)) * COALESCE(order_items.quantity, 1)) AS revenue, SUM(order_items.quantity) AS units FROM orders JOIN order_items ON order_items.order_id = orders.id LEFT JOIN items ON items.id = order_items.item_id WHERE orders.store_id = $1 AND orders.status = 'completed' AND ${timeConstraint(
      range,
      undefined,
      "completed_on",
    )} GROUP BY category_name ORDER BY revenue DESC LIMIT 5`,
    [user.id],
  );

  return new Response(JSON.stringify(data));
}
