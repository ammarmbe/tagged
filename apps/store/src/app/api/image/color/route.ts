import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  return new Response("DEMO");

  const { id, color } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  await sql(
    "UPDATE item_images SET color = $1 WHERE id = $2 AND item_id IN (SELECT id FROM items WHERE store_id = $3)",
    [color === "No color" ? null : color, id, user.id],
  );

  return new Response("OK");
}
