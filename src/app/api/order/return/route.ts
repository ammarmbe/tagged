import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { reason, orderId } = await req.json();

  const { user } = await getUser();

  if (!reason) return new Response(null, { status: 400 });

  const [order] = await sql(
    "SELECT status FROM orders WHERE id = $1 AND user_id = $2",
    [orderId, user?.id],
  );

  if (order?.status !== "completed") return new Response(null, { status: 400 });

  await sql(
    "UPDATE orders SET status = 'return_requested', return_reason = $1 WHERE id = $2 AND user_id = $3",
    [reason, orderId, user?.id],
  );

  return new Response("OK");
}
