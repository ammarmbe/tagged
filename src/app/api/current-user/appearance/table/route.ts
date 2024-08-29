import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  return new Response("DEMO");

  const { user } = await getUser();
  const { table } = await req.json();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  if (["compact", "comfortable"].includes(table) === false) {
    return new Response(JSON.stringify(null), {
      status: 400,
    });
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{table_size}', to_jsonb($1::text)) WHERE id = $2`,
    [table, user.id],
  );

  return new Response("OK");
}
