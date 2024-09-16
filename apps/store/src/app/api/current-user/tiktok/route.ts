import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  return new Response("DEMO");

  let { tiktok } = await req.json();
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (!tiktok.startsWith("@")) {
    tiktok = "@" + tiktok;
  }

  const params = [user.id];
  if (tiktok) {
    params.unshift(tiktok);
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{tiktok}', ${tiktok ? "to_jsonb($1::text)" : "'null'"}) WHERE id = $${tiktok ? 2 : 1}`,
    params,
  );

  return new Response("OK");
}
