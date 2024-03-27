import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { exchangePolicy } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  await sql(
    "UPDATE store_settings SET exchange_policy = $1 WHERE store_id = $2",
    [exchangePolicy, user.id],
  );

  return new Response("OK");
}
