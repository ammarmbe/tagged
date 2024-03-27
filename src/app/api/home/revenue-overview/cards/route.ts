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

  const prevTimeConstraint =
    range === "day"
      ? "DATE(completed_on) = CURRENT_DATE - interval '1 day'"
      : range === "week"
        ? "EXTRACT(WEEK FROM completed_on) = EXTRACT(WEEK FROM CURRENT_DATE - interval '1 week') AND (CASE WHEN EXTRACT(WEEK FROM CURRENT_DATE) = 1 THEN EXTRACT(YEAR FROM completed_on) = EXTRACT(YEAR FROM CURRENT_DATE - interval '1 year') ELSE EXTRACT(YEAR FROM completed_on) = EXTRACT(YEAR FROM CURRENT_DATE) END)"
        : range === "month"
          ? "EXTRACT(MONTH FROM completed_on) = EXTRACT(MONTH FROM CURRENT_DATE - interval '1 month') AND (CASE WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 1 THEN EXTRACT(YEAR FROM completed_on) = EXTRACT(YEAR FROM CURRENT_DATE - interval '1 year') ELSE EXTRACT(YEAR FROM completed_on) = EXTRACT(YEAR FROM CURRENT_DATE) END)"
          : range === "year"
            ? "EXTRACT(YEAR FROM completed_on) = EXTRACT(YEAR FROM CURRENT_DATE - interval '1 year')"
            : "1=1";

  const data = await sql(
    `SELECT 'revenue' AS type, SUM((COALESCE(price, 0) - COALESCE(discount, 0)) * COALESCE(quantity, 1)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND orders.status = 'completed' AND ${timeConstraint(
      range,
      undefined,
      "completed_on",
    )} UNION SELECT 'potential' AS type, SUM((COALESCE(price, 0) - COALESCE(discount, 0)) * COALESCE(quantity, 1)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND (orders.status = 'cancelled' OR orders.status = 'customer_cancelled') AND ${timeConstraint(
      range,
      undefined,
      "completed_on",
    )} UNION SELECT 'units' AS type, SUM(COALESCE(quantity, 0)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND orders.status = 'completed' AND ${timeConstraint(
      range,
      undefined,
      "completed_on",
    )} UNION SELECT 'prev_revenue' AS type, SUM((COALESCE(price, 0) - COALESCE(discount, 0)) * COALESCE(quantity, 1)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND orders.status = 'completed' AND ${prevTimeConstraint} UNION SELECT 'prev_potential' AS type, SUM((COALESCE(price, 0) - COALESCE(discount, 0)) * COALESCE(quantity, 1)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND (orders.status = 'cancelled' OR orders.status = 'customer_cancelled') AND ${prevTimeConstraint} UNION SELECT 'prev_units' AS type, SUM(COALESCE(quantity, 0)) AS revenue FROM orders JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND orders.status = 'completed' AND ${prevTimeConstraint}`,
    [user.id],
  );

  return new Response(
    JSON.stringify({
      revenue: data
        .filter((d) => d.type === "revenue")
        .map((d) => d.revenue)
        .reduce((a, b) => a + b, 0),
      potential: data
        .filter((d) => d.type === "potential")
        .map((d) => d.revenue)
        .reduce((a, b) => a + b, 0),
      units: data
        .filter((d) => d.type === "units")
        .map((d) => d.revenue)
        .reduce((a, b) => a + b, 0),
      prev_revenue: data
        .filter((d) => d.type === "prev_revenue")
        .map((d) => d.revenue)
        .reduce((a, b) => a + b, 0),
      prev_potential: data
        .filter((d) => d.type === "prev_potential")
        .map((d) => d.revenue)
        .reduce((a, b) => a + b, 0),
      prev_units: data
        .filter((d) => d.type === "prev_units")
        .map((d) => d.revenue)
        .reduce((a, b) => a + b, 0),
    }),
  );
}
