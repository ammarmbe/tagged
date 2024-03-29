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
    `SELECT DISTINCT item_configs.color AS name, array_agg(item_configs.size) AS sizes, SUM(item_configs.quantity) AS quantity, (SELECT SUM((order_items.price - order_items.discount) * order_items.quantity) FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_items.color = item_configs.color AND order_items.item_id = items.id AND ${timeConstraint(
      range,
      "orders",
      "completed_at",
    )}) AS revenue FROM item_configs JOIN items ON items.id = item_configs.item_id WHERE items.store_id = $1 AND items.nano_id = $2 GROUP BY item_configs.color, items.id`,
    [user.id, nano_id],
  );

  return new Response(JSON.stringify(data));
}
