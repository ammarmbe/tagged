import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const data = await sql(
    "SELECT categories, color, color_value, size, quantity, items.name as item_name, items.description as description, price, discount, users.name as store_name, users.id as store_id, items.id as item_id FROM item_details JOIN items ON items.id = item_details.item_id JOIN users ON users.id = items.store_id WHERE items.id = $1 AND items.deleted != true",
    [id],
  );

  if (!data[0]) {
    return new Response(JSON.stringify(null), { status: 404 });
  }

  return new Response(
    JSON.stringify({
      categories: data[0].categories,
      item_id: data[0].item_id,
      item_name: data[0].item_name,
      store_name: data[0].store_name,
      description: data[0].description,
      store_id: data[0].store_id,
      price: data[0].price,
      discount: data[0].discount,
      configurations: data.map((item) => ({
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        color_value: item.color_value,
      })),
      colors: Array.from(new Set(data.map((item) => item.color))).map(
        (color) => {
          return {
            name: color,
            value: data.find((item) => item.color === color)?.color_value,
          };
        },
      ),
      sizes: Array.from(new Set(data.map((item) => item.size))),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
