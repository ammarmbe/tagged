import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  const data = await sql(
    "SELECT users.pfp_url, users.cover_url, users.name, feature_flags ->> 'description' AS description, feature_flags ->> 'instagram' AS instagram, feature_flags ->> 'facebook' AS facebook, feature_flags ->> 'tiktok' AS tiktok FROM users WHERE nano_id = $1",
    [nano_id],
  );

  const data2 = await sql(
    "SELECT 'return_rate' AS name, (SELECT COUNT(*) FROM orders WHERE store_id = (SELECT id FROM users WHERE nano_id = $1) AND status = 'returned' OR status = 'return_requested') / NULLIF((SELECT COUNT(*) FROM orders WHERE store_id = (SELECT id FROM users WHERE nano_id = $1) AND status = 'completed') , 0) AS value UNION ALL SELECT 'average_time_to_completed' AS name, (SELECT EXTRACT(epoch FROM AVG(completed_at - created_at)) FROM orders WHERE store_id = (SELECT id FROM users WHERE nano_id = $1)) AS value UNION ALL SELECT 'cancel_rate' AS name, (SELECT COUNT(*) FROM orders WHERE store_id = (SELECT id FROM users WHERE nano_id = $1) AND status = 'cancelled') / NULLIF((SELECT COUNT(*) FROM orders WHERE store_id = (SELECT id FROM users WHERE nano_id = $1) AND status = 'completed') , 0) AS value",
    [nano_id],
  );

  return new Response(
    JSON.stringify({
      ...data[0],
      deliver_in: data2.find((d) => d.name === "average_time_to_completed")
        ?.value,
      return_rate: data2.find((d) => d.name === "return_rate")?.value,
      cancel_rate: data2.find((d) => d.name === "cancel_rate")?.value,
    }),
  );
}
