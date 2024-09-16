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
      "SELECT name, nano_id FROM items WHERE store_id = $1 AND items.deleted != true ORDER BY id DESC LIMIT 3",
      [user.id],
    );
  } else {
    data = await sql(
      "SELECT name, nano_id FROM items WHERE store_id = $1 AND (name % $2 OR nano_id = $2) AND items.deleted != true ORDER BY similarity(name, $2) DESC LIMIT 3",
      [user.id, searchTerm],
    );
  }

  return new Response(JSON.stringify(data));
}
