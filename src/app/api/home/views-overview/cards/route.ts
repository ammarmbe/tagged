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
      ? "DATE(created_at) = CURRENT_DATE - interval '1 day'"
      : range === "week"
        ? "EXTRACT(WEEK FROM created_at) = EXTRACT(WEEK FROM CURRENT_DATE - interval '1 week') AND (CASE WHEN EXTRACT(WEEK FROM CURRENT_DATE) = 1 THEN EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE - interval '1 year') ELSE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) END)"
        : range === "month"
          ? "EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE - interval '1 month') AND (CASE WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 1 THEN EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE - interval '1 year') ELSE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) END)"
          : range === "year"
            ? "EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE - interval '1 year')"
            : "1=1";

  const categories = await sql(
    `SELECT categories, COUNT(*) AS views, COALESCE((SELECT COUNT(*) FROM views JOIN items ON items.id = views.item_id WHERE items.store_id = $1 AND ${prevTimeConstraint} GROUP BY categories ORDER BY COUNT(*) LIMIT 1), 0) AS previous FROM views JOIN items ON items.id = views.item_id WHERE items.store_id = $1 AND ${timeConstraint(range)} GROUP BY categories ORDER BY views DESC LIMIT 1`,
    [user.id],
  );

  const item = await sql(
    `SELECT items.name, items.nano_id, COUNT(*) AS views, COALESCE((SELECT COUNT(*) FROM views JOIN items ON items.id = views.item_id WHERE items.store_id = $1 AND ${prevTimeConstraint} GROUP BY items.id ORDER BY COUNT(*) LIMIT 1), 0) AS previous FROM views JOIN items ON items.id = views.item_id WHERE items.store_id = $1 AND ${timeConstraint(range)} GROUP BY items.id ORDER BY views DESC LIMIT 1`,
    [user.id],
  );

  return new Response(
    JSON.stringify({
      item_name: item[0]?.name,
      item_nano_id: item[0]?.nano_id,
      category: categories[0]?.categories,
      category_views: categories[0]?.views,
      item_views: item[0]?.views,
      category_previous: categories[0]?.previous,
      item_previous: item[0]?.previous,
    }),
  );
}
