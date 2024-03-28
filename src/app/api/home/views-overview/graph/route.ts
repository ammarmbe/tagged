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
      "SELECT TO_CHAR(date_series, 'DD/MM') AS date, COUNT(views.*) AS views FROM GENERATE_SERIES(CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE, '1 day') AS date_series LEFT JOIN views ON date_series = DATE(views.created_at) LEFT JOIN items ON items.id = views.item_id WHERE (items.store_id IS NULL AND views.store_id IS NULL) OR (items.store_id = $1 OR views.store_id = $1) GROUP BY date_series ORDER BY date_series",
    year: "SELECT TO_CHAR(date_series, 'Month') AS date, COUNT(views.*) AS views FROM GENERATE_SERIES(CURRENT_DATE - INTERVAL '11 months', CURRENT_DATE, '1 month') AS date_series LEFT JOIN views ON DATE_TRUNC('month', date_series) = DATE_TRUNC('month', views.created_at) LEFT JOIN items ON items.id = views.item_id WHERE (items.store_id IS NULL AND views.store_id IS NULL) OR (items.store_id = $1 OR views.store_id = $1) GROUP BY date_series ORDER BY date_series",
    week: "SELECT TO_CHAR(date_series, 'Day') AS date, COUNT(views.*) AS views FROM GENERATE_SERIES(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') AS date_series LEFT JOIN views ON DATE_TRUNC('day', date_series) = DATE_TRUNC('day', views.created_at) LEFT JOIN items ON items.id = views.item_id WHERE (items.store_id IS NULL AND views.store_id IS NULL) OR (items.store_id = $1 OR views.store_id = $1) GROUP BY date ORDER BY MIN(date_series)",
    day: "SELECT TO_CHAR(date_series, 'HH12:00 AM') AS date, COUNT(views.*) AS views FROM GENERATE_SERIES(CURRENT_TIMESTAMP - INTERVAL '23 hours', CURRENT_TIMESTAMP, '1 hour') AS date_series LEFT JOIN views ON DATE_TRUNC('hour', date_series) = DATE_TRUNC('hour', views.created_at) LEFT JOIN items ON items.id = views.item_id WHERE (items.store_id IS NULL AND views.store_id IS NULL) OR (items.store_id = $1 OR views.store_id = $1) GROUP BY date ORDER BY MIN(date_series)",
    all: "SELECT orders_year AS date, COUNT(views.*) AS views FROM (SELECT EXTRACT(YEAR FROM MIN(completed_on)) AS min_year, EXTRACT(YEAR FROM CURRENT_DATE) AS max_year FROM orders) AS year_range CROSS JOIN GENERATE_SERIES(min_year::INTEGER, max_year::INTEGER) AS orders_year LEFT JOIN views ON EXTRACT(YEAR FROM views.created_at) = orders_year LEFT JOIN items ON items.id = views.item_id WHERE (items.store_id IS NULL AND views.store_id IS NULL) OR (items.store_id = $1 OR views.store_id = $1) GROUP BY date ORDER BY date",
  };

  const data = await sql(queries[range], [user.id]);

  return new Response(JSON.stringify(data));
}
