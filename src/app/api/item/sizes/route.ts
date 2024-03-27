import { timeConstraint } from "@/utils";
import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") as
    | "day"
    | "week"
    | "month"
    | "year"
    | "all";
  const nano_id = searchParams.get("nano_id");

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const data = await sql(
    `SELECT DISTINCT item_details.size AS name, array_agg(item_details.color) AS colors, SUM(item_details.quantity) AS quantity, (SELECT SUM((order_items.price - order_items.discount) * order_items.quantity) FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_items.size = item_details.size AND order_items.item_id = items.id AND ${timeConstraint(
      range,
      undefined,
      "completed_on",
    )}) AS revenue FROM item_details JOIN items ON items.id = item_details.item_id WHERE items.store_id = $1 AND items.nano_id = $2 GROUP BY item_details.size, items.id`,
    [user.id, nano_id],
  );

  return new Response(JSON.stringify(data));
}
