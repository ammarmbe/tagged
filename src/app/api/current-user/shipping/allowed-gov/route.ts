import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  return new Response("DEMO");

  const { allowed_gov } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{allowed_gov}', to_jsonb($1::text[])) WHERE id = $2`,
    [allowed_gov, user.id],
  );

  return new Response("OK");
}
