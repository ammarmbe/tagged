import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in.", { status: 401 });
  }

  const data = await sql("SELECT * FROM order_items WHERE order_id = $1", [
    orderId,
  ]);

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
