import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  const { user } = await getUser();

  const [order] = await sql(
    "SELECT status FROM orders WHERE id = $1 AND user_id = $2",
    [orderId, user?.id],
  );

  if (order?.status !== "pending") return new Response(null, { status: 400 });

  await sql(
    "UPDATE orders SET status = 'customer_cancelled' WHERE id = $1 AND user_id = $2",
    [orderId, user?.id],
  );

  return new Response("OK");
}
