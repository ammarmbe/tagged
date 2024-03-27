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

  const date =
    range === "day"
      ? "TO_CHAR(completed_on, 'HH12') || ':00 PM' as date"
      : range === "week"
        ? "TO_CHAR(completed_on, 'Day') as date"
        : range === "month"
          ? "TO_CHAR(completed_on, 'DD/MM') as date"
          : range === "year"
            ? "LEFT(TO_CHAR(completed_on, 'Month'), 3) as date"
            : "EXTRACT(YEAR FROM completed_on) as date";

  const data = await sql(
    `SELECT 'revenue' AS type, ${date}, SUM((COALESCE(price, 0) - COALESCE(discount, 0)) * COALESCE(quantity, 1)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND orders.status = 'completed' AND ${timeConstraint(
      range,
      undefined,
      "completed_on",
    )} GROUP BY date UNION SELECT 'potential' AS type, ${date}, SUM((COALESCE(price, 0) - COALESCE(discount, 0)) * COALESCE(quantity, 1)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND (orders.status = 'cancelled' OR orders.status = 'customer_cancelled') AND ${timeConstraint(
      range,
      undefined,
      "completed_on",
    )} GROUP BY date`,
    [user.id],
  );

  return new Response(JSON.stringify(data));
}
