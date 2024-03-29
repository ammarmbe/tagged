import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  const { user } = await getUser();

  if (!user) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const data = await sql(
    "SELECT items.category, items.deleted, items.id, name, description, price, discount, SUM(quantity) as quantity, ARRAY_AGG(DISTINCT size) as sizes, ARRAY_AGG(DISTINCT color) as colors, (SELECT ARRAY_AGG(color || ' / ' || size || ': ' || quantity) FROM item_configs WHERE item_configs.item_id = items.id) AS quantities FROM items LEFT JOIN item_configs ON item_configs.item_id = items.id WHERE items.nano_id = $1 AND items.store_id = $2 GROUP BY items.category, items.id, name, description, price, discount",
    [nano_id, user.id],
  );

  return new Response(JSON.stringify(data[0]));
}

export async function PATCH(req: Request) {
  const { user } = await getUser();
  const {
    id,
    name,
    description,
    category,
    price,
    discount,
    colors,
    sizes,
    old_colors,
    old_sizes,
  }: {
    id: string;
    name: string;
    description: string;
    category: string[];
    price: number;
    discount: number;
    colors: string[];
    sizes: string[];
    old_colors: string[] | undefined;
    old_sizes: string[] | undefined;
  } = await req.json();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const { store_id } = (
    await sql("SELECT store_id FROM items WHERE id = $1", [id])
  )[0];

  if (user.id !== store_id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (!colors || !sizes) {
    await sql(
      "DELETE FROM item_configs WHERE color = ANY($1) OR size = ANY($2) AND item_id = $3",
      [
        old_colors?.filter((c) => !colors.includes(c)),
        old_sizes?.filter((s) => !sizes.includes(s)),
        id,
      ],
    );
  }

  await sql(
    "UPDATE items SET name = $1, description = $2, category = $3, price = $4, discount = $5 WHERE id = $6 AND store_id = $7",
    [name, description, category, price, discount, id, user.id],
  );

  colors
    .filter((c) => !old_colors?.includes(c))
    .forEach(async (color) => {
      sizes
        .filter((s) => !old_sizes?.includes(s))
        .forEach(async (size) => {
          await sql(
            "INSERT INTO item_configs (item_id, color, size, quantity) VALUES ($1, $2, $3, 0) ON CONFLICT (item_id, color, size) DO NOTHING",
            [id, color, size],
          );
        });
    });

  return new Response("OK");
}
