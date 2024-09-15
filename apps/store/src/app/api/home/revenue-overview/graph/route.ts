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

  const queries = {
    month:
      "SELECT TO_CHAR(date_series, 'DD/MM') AS date, COALESCE(SUM((price - discount) * quantity), 0) AS revenue FROM GENERATE_SERIES(CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE, '1 day') AS date_series LEFT JOIN orders ON date_series = DATE(orders.completed_at) LEFT JOIN order_items ON orders.id = order_items.order_id WHERE (orders.store_id = $1 OR orders.store_id IS NULL) AND (orders.status = 'completed' OR orders.status IS NULL) GROUP BY date_series ORDER BY date_series",
    year: "SELECT TO_CHAR(date_series, 'Month') AS date, COALESCE(SUM((price - discount) * quantity), 0) AS revenue FROM GENERATE_SERIES(CURRENT_DATE - INTERVAL '11 months', CURRENT_DATE, '1 month') AS date_series LEFT JOIN orders ON DATE_TRUNC('month', date_series) = DATE_TRUNC('month', orders.completed_at) LEFT JOIN order_items ON orders.id = order_items.order_id WHERE (orders.store_id = $1 OR orders.store_id IS NULL) AND (orders.status = 'completed' OR orders.status IS NULL) GROUP BY date_series ORDER BY date_series",
    week: "SELECT TO_CHAR(date_series, 'Day') AS date, COALESCE(SUM((price - discount) * quantity), 0) AS revenue FROM GENERATE_SERIES(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') AS date_series LEFT JOIN orders ON DATE_TRUNC('day', date_series) = DATE_TRUNC('day', orders.completed_at) LEFT JOIN order_items ON orders.id = order_items.order_id WHERE (orders.store_id = $1 OR orders.store_id IS NULL) AND (orders.status = 'completed' OR orders.status IS NULL) GROUP BY date ORDER BY MIN(date_series)",
    day: "SELECT TO_CHAR(date_series, 'HH12:00 AM') AS date, COALESCE(SUM((price - discount) * quantity), 0) AS revenue FROM GENERATE_SERIES(CURRENT_TIMESTAMP - INTERVAL '23 hours', CURRENT_TIMESTAMP, '1 hour') AS date_series LEFT JOIN orders ON DATE_TRUNC('hour', date_series) = DATE_TRUNC('hour', orders.completed_at) LEFT JOIN order_items ON orders.id = order_items.order_id WHERE (orders.store_id = $1 OR orders.store_id IS NULL) AND (orders.status = 'completed' OR orders.status IS NULL) GROUP BY date ORDER BY MIN(date_series)",
    all: "SELECT orders_year AS date, COALESCE(SUM((price - discount) * quantity), 0) AS revenue FROM (SELECT EXTRACT(YEAR FROM MIN(completed_at)) AS min_year, EXTRACT(YEAR FROM CURRENT_DATE) AS max_year FROM orders) AS year_range CROSS JOIN GENERATE_SERIES(min_year::INTEGER, max_year::INTEGER) AS orders_year LEFT JOIN orders ON EXTRACT(YEAR FROM orders.completed_at) = orders_year LEFT JOIN order_items ON orders.id = order_items.order_id WHERE (orders.store_id = $1 OR orders.store_id IS NULL) AND (orders.status = 'completed' OR orders.status IS NULL) GROUP BY date ORDER BY date",
  };

  const data = await sql(queries[range], [user.id]);

  return new Response(JSON.stringify(data));
}
