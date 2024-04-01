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
    "SELECT DISTINCT color_hex AS hex, color FROM item_configs WHERE item_id IN (SELECT id FROM items WHERE store_id = $1 AND nano_id = $2) GROUP BY color, hex",
    [user.id, nano_id],
  );

  return new Response(JSON.stringify(data));
}
