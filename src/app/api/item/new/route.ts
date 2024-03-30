import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { customAlphabet } from "nanoid";

const nanoId = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

export async function POST(req: Request) {
  const {
    itemDetails,
    quantities,
  }: {
    itemDetails: {
      name: string;
      description: string;
      price: number;
      discount: number;
      category: {
        label: string;
        value: string[];
      };
    };
    quantities: {
      color: string;
      size: string;
      color_hex: string;
      quantity: number | undefined;
    }[];
  } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  const nano_id = nanoId();

  const id = await sql(
    "INSERT INTO items (name, description, price, discount, category, store_id, nano_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
    [
      itemDetails.name,
      itemDetails.description,
      itemDetails.price,
      itemDetails.discount ?? 0,
      itemDetails.category.value,
      user.id,
      nano_id,
    ],
  );

  quantities.forEach(async ({ color, size, quantity, color_hex }) => {
    await sql(
      "INSERT INTO item_configs (item_id, color, size, quantity, color_hex) VALUES ($1, $2, $3, $4, $5)",
      [id[0].id, color, size, quantity || 0, color_hex],
    );
  });

  return new Response(nano_id);
}
