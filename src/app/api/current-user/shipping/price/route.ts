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

  if (isNaN(parseInt(price))) {
    return new Response(JSON.stringify(null), {
      status: 400,
    });
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{shipping_price}', '${price}') WHERE id = $1`,
    [user.id],
  );

  return new Response("OK");
}
