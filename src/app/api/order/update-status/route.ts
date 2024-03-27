import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const { nano_id, status, cancel_reason } = await req.json();

  const statuses = [
    "pending",
    "confirmed",
    "shipped",
    "completed",
    "store_cancelled",
  ];

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const current_status = await sql(
    "SELECT status FROM orders WHERE nano_id = $1 AND store_id = $2",
    [nano_id, user.id],
  );

  if (
    (status === "store_cancelled" && !cancel_reason) ||
    !statuses.includes(status) ||
    statuses.findIndex((s) => s === current_status[0].status) >=
      statuses.findIndex((s) => s === status)
  ) {
    return new Response(JSON.stringify(null), { status: 400 });
  }

  await sql(
    `UPDATE orders SET status = $1, ${status === "completed" ? "completed_on = now() at time zone 'Africa/Cairo', " : ""}reason = $2 WHERE nano_id = $3 AND store_id = $4`,
    [status, cancel_reason, nano_id, user.id],
  );

  await sql(
    "INSERT INTO order_status_changes (order_id, status) VALUES ((SELECT id FROM orders WHERE nano_id = $1), $2)",
    [nano_id, status],
  );

  return new Response("OK");
}
