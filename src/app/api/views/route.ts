import sql from "@/utils/db";

export async function POST(req: Request) {
  const { store_id, item_id, ip } = await req.json();

  await sql(
    "INSERT INTO views (item_id, store_id, ip) VALUES ((SELECT id FROM items WHERE nano_id = $1), $2, $3)",
    [item_id, store_id, ip || 0 + new Date(Date.now()).toDateString()],
  );

  return new Response("OK", {
    status: 200,
  });
}
