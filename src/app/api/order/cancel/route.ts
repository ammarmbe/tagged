import sql from "@/utils/db";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  await sql("UPDATE orders SET status = 'customer_cancelled' WHERE id = $1", [
    orderId,
  ]);

  return new Response("OK", {
    status: 200,
  });
}
