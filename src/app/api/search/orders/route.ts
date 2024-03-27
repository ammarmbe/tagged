import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("search_term");

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  let data: Record<string, any>[];

  if (!searchTerm) {
    data = await sql(
      "SELECT nano_id FROM orders WHERE store_id = $1 ORDER BY created_at DESC LIMIT 3",
      [user.id],
    );
  } else {
    data = await sql(
      "SELECT nano_id FROM orders WHERE store_id = $1 AND (nano_id = $2) ORDER BY similarity(nano_id, $2) DESC LIMIT 3",
      [user.id, `%${searchTerm}%`],
    );
  }

  return new Response(JSON.stringify(data));
}
