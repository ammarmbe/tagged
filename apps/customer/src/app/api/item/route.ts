import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  if (!nano_id) {
    return new Response("Missing nano_id", { status: 400 });
  }

  const data = await sql(
    "SELECT category, color, color_hex, size, quantity, users.nano_id AS store_nano_id, items.name as item_name, items.description as description, price, discount, users.name as store_name, users.id as store_id, items.id as item_id FROM item_configs JOIN items ON items.id = item_configs.item_id JOIN users ON users.id = items.store_id WHERE items.nano_id = $1 AND items.deleted != true",
    [nano_id],
  );

  if (!data[0]) {
    return new Response(JSON.stringify(null), { status: 404 });
  }

  return new Response(
    JSON.stringify({
      category: data[0].category,
      item_id: data[0].item_id,
      item_name: data[0].item_name,
      store_nano_id: data[0].store_nano_id,
      store_name: data[0].store_name,
      description: data[0].description,
      store_id: data[0].store_id,
      price: data[0].price,
      discount: data[0].discount,
      configurations: data.map((item) => ({
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        color_hex: item.color_hex,
      })),
      colors: Array.from(new Set(data.map((item) => item.color))).map(
        (color) => {
          return {
            name: color,
            value: data.find((item) => item.color === color)?.color_hex,
          };
        },
      ),
      sizes: Array.from(new Set(data.map((item) => item.size))),
    }),
  );
}
