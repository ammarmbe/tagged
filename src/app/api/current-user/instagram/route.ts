import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  return new Response("DEMO");

  let { instagram } = await req.json();
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (instagram.startsWith("@")) {
    instagram = instagram.slice(1);
  }

  const params = [user.id];
  if (instagram) {
    params.unshift(instagram);
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{instagram}', ${instagram ? "to_jsonb($1::text)" : "'null'"}) WHERE id = $${instagram ? 2 : 1}`,
    params,
  );

  return new Response("OK");
}
