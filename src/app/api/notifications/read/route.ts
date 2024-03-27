import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  let id = searchParams.get("id") ? searchParams.get("id") : null;

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  await sql(
    "UPDATE notifications SET read = true WHERE store_id = $1 AND (id = $2 OR $2 IS NULL)",
    [user.id, id],
  );

  return new Response("OK");
}
