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
      ? "TO_CHAR(created_at, 'HH12') || ':00 PM' as date"
      : range === "week"
        ? "TO_CHAR(created_at, 'Day') as date"
        : range === "month"
          ? "TO_CHAR(created_at, 'DD/MM') as date"
          : range === "year"
            ? "LEFT(TO_CHAR(created_at, 'Month'), 3) as date"
            : "EXTRACT(YEAR FROM created_at) as date";

  const data = await sql(
    `SELECT ${date}, COUNT(*) AS views FROM views LEFT JOIN items ON items.id = views.item_id WHERE (items.store_id IS NULL AND views.store_id = $1) OR items.store_id = $1 AND ${timeConstraint(
      range,
    )} GROUP BY date`,
    [user.id],
  );

  return new Response(JSON.stringify(data));
}
