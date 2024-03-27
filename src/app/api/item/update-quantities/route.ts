import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const {
    id,
    quantities,
  }: {
    id: string;
    quantities: {
      color: string;
      size: string;
      quantity: string;
    }[];
  } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  quantities.forEach(async (q) => {
    await sql(
      "UPDATE item_details SET quantity = $1 FROM items WHERE items.id = item_details.item_id AND item_id = $2 AND color = $3 AND size = $4 AND items.store_id = $5",
      [q.quantity, id, q.color, q.size, user.id]
    );
  });

  return new Response("OK");
}
