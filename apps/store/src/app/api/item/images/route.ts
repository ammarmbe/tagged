import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const data = await sql(
    "SELECT item_images.* FROM item_images JOIN items ON items.id = item_images.item_id WHERE items.nano_id = $1 AND items.store_id = $2",
    [nano_id, user.id],
  );

  return new Response(JSON.stringify(data));
}
