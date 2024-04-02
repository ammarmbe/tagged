import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const { user } = await getUser();
  const { theme } = await req.json();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  if (["dark", "light", undefined].includes(theme) === false) {
    return new Response(JSON.stringify(null), {
      status: 400,
    });
  }

  const params = [user.id];
  if (theme) {
    params.unshift(theme);
  }

  await sql(
    `UPDATE users SET feature_flags = jsonb_set(feature_flags, '{color_theme}', ${theme ? "to_jsonb($1::text)" : "'null'"}) WHERE id = $2`,
    params,
  );

  return new Response("OK");
}
