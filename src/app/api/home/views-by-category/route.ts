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
    `SELECT categories, COUNT(*) AS views FROM views JOIN items ON items.id = views.item_id WHERE items.store_id = $1 AND ${timeConstraint(
      range,
    )} GROUP BY categories`,
    [user.id],
  );

  return new Response(JSON.stringify(data));
}
