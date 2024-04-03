import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const { id } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  await sql(
    "UPDATE item_images SET thumbnail = (item_images.id = $1) WHERE item_id IN (SELECT id FROM items WHERE store_id = $2)",
    [id, user.id],
  );

  return new Response("OK");
}
