import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { price } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  await sql(
    "UPDATE store_settings SET shipping_price = $1 WHERE store_id = $2",
    [price, user.id],
  );

  return new Response("OK");
}
