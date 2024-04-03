import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const item_id = searchParams.get("item_id");

  const data = await sql(
    "SELECT * from item_images WHERE item_id = $1 ORDER BY thumbnail DESC NULLS LAST",
    [item_id],
  );

  return new Response(JSON.stringify(data));
}
