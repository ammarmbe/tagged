import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { customAlphabet } from "nanoid";

const nanoId = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

export async function POST(req: Request) {
  const {
    itemDetails,
    quantities,
    images,
  }: {
    itemDetails: {
      name?: string | undefined;
      description?: string | undefined;
      price?: number | undefined;
      discount?: number | undefined;
      category?:
        | {
            label?: string | undefined;
            value?: string[] | undefined;
          }
        | undefined;
    };
    quantities: {
      color?: string | undefined;
      size?: string | undefined;
      hex?: string | undefined;
      quantity?: number | undefined;
    }[];
    images: {
      color: string | undefined;
      url: string | undefined;
      id: string;
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
      itemDetails.price || 0,
      itemDetails.discount || 0,
      itemDetails.category?.value?.map((v) => v.toLowerCase()),
      user.id,
      nano_id,
    ],
  );

  quantities.forEach(async ({ color, size, quantity, hex }) => {
    await sql(
      "INSERT INTO item_configs (item_id, color, size, quantity, color_hex) VALUES ($1, $2, $3, $4, $5)",
      [id[0]?.id, color, size, quantity || 0, hex],
    );
  });

  images.forEach(async ({ color, url, id: i }) => {
    await sql(
      "INSERT INTO item_images (item_id, color, url, id) VALUES ($1, $2, $3, $4)",
      [id[0]?.id, color, url, i],
    );
  });

  return new Response(nano_id);
}
