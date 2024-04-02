import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const data = await sql(
    "SELECT 'conversion_rate' AS name, (SELECT COUNT(*) FROM orders WHERE store_id = $1 AND status = 'completed' AND completed_at >= NOW() - INTERVAL '1 week') / NULLIF((SELECT COUNT(DISTINCT ip) FROM VIEWS JOIN items ON items.id = views.item_id WHERE (views.store_id = $1 OR items.id = $1) AND views.created_at >= NOW() - INTERVAL '1 week') , 0) AS value UNION ALL SELECT 'prev_conversion_rate' AS name, (SELECT COUNT(*) FROM orders WHERE store_id = $1 AND status = 'completed' AND completed_at >= NOW() - INTERVAL '2 week' AND completed_at < NOW() - INTERVAL '1 week') / NULLIF((SELECT COUNT(DISTINCT ip) FROM VIEWS JOIN items ON items.id = views.item_id WHERE (views.store_id = $1 OR items.id = $1) AND views.created_at >= NOW() - INTERVAL '2 week' AND views.created_at < NOW() - INTERVAL '1 week') , 0) AS value UNION ALL SELECT 'average_order_value' AS name, (SELECT AVG((price - discount) * quantity) FROM orders JOIN order_items ON orders.id = order_items.order_id WHERE store_id = $1 AND status = 'completed' AND completed_at >= NOW() - INTERVAL '1 week') AS value UNION ALL SELECT 'prev_average_order_value' AS name, (SELECT AVG((price - discount) * quantity) FROM orders JOIN order_items ON orders.id = order_items.order_id WHERE store_id = $1 AND status = 'completed' AND completed_at >= NOW() - INTERVAL '2 week' AND completed_at < NOW() - INTERVAL '1 week') AS value UNION ALL SELECT 'return_rate' AS name, (SELECT COUNT(*) FROM orders WHERE store_id = $1 AND status = 'returned' AND completed_at >= NOW() - INTERVAL '1 week') / NULLIF((SELECT COUNT(*) FROM orders WHERE store_id = $1 AND status = 'completed' AND completed_at >= NOW() - INTERVAL '1 week') , 0) AS value UNION ALL SELECT 'prev_return_rate' AS name, (SELECT COUNT(*) FROM orders WHERE store_id = $1 AND status = 'returned' AND completed_at >= NOW() - INTERVAL '2 week' AND completed_at < NOW() - INTERVAL '1 week') / NULLIF((SELECT COUNT(*) FROM orders WHERE store_id = $1 AND status = 'completed' AND completed_at >= NOW() - INTERVAL '2 week' AND completed_at < NOW() - INTERVAL '1 week') , 0) AS value UNION ALL SELECT 'average_time_to_completed' AS name, (SELECT EXTRACT(epoch FROM AVG(completed_at - created_at)) FROM orders WHERE store_id = $1 AND completed_at >= NOW() - INTERVAL '1 week') AS value UNION ALL SELECT 'prev_average_time_to_completed' AS name, (SELECT EXTRACT(epoch FROM AVG(completed_at - created_at)) FROM orders WHERE store_id = $1 AND completed_at >= NOW() - INTERVAL '2 week' AND completed_at < NOW() - INTERVAL '1 week') AS value",
    [user.id],
  );

  return new Response(
    JSON.stringify({
      conversion_rate:
        data.find((d) => d.name === "conversion_rate")?.value ?? 0,
      average_order_value:
        data.find((d) => d.name === "average_order_value")?.value ?? 0,
      return_rate: data.find((d) => d.name === "return_rate")?.value ?? 0,
      prev_conversion_rate:
        data.find((d) => d.name === "prev_conversion_rate")?.value ?? 0,
      prev_average_order_value:
        data.find((d) => d.name === "prev_average_order_value")?.value ?? 0,
      prev_return_rate:
        data.find((d) => d.name === "prev_return_rate")?.value ?? 0,
      average_time_to_completed:
        data.find((d) => d.name === "average_time_to_completed")?.value ?? 0,
      prev_average_time_to_completed:
        data.find((d) => d.name === "prev_average_time_to_completed")?.value ??
        0,
    }),
  );
}
