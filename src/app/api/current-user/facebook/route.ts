import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  return new Response("DEMO");

  let { facebook } = await req.json();
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (facebook.startsWith("@")) {
    facebook = facebook.slice(1);
  }

  const params = [user.id];
  if (facebook) {
    params.unshift(facebook);
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{facebook}', ${facebook ? "to_jsonb($1::text)" : "'null'"}) WHERE id = $${facebook ? 2 : 1}`,
    params,
  );

  return new Response("OK");
}
