import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { return_period } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  if (["1d", "3d", "7d", "14d", "30d", ""].includes(return_period) === false) {
    return new Response(JSON.stringify(null), {
      status: 400,
    });
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{return_period}', to_jsonb($1::text)) WHERE id = $2`,
    [return_period, user.id],
  );

  return new Response("OK");
}
