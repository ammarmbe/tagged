import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const { selected }: { selected: true | number[] } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  if (selected === true) {
    await sql(
      "UPDATE item_configs SET quantity = 0 FROM items WHERE items.id = item_configs.item_id AND items.store_id = $1",
      [user.id],
    );
  }

  await sql(
    "UPDATE item_configs SET quantity = 0 FROM items WHERE items.id = item_configs.item_id AND items.id = ANY($1) AND items.store_id = $2",
    [selected, user.id],
  );

  return new Response("OK");
}
