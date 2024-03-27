import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") as string | undefined;

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
