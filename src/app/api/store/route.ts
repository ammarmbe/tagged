import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const data = await sql(
    "SELECT users.name, description, instagram, facebook, twitter FROM store_settings JOIN users ON users.id = store_id WHERE store_id = $1",
    [id],
  );

  return new Response(JSON.stringify(data[0]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
