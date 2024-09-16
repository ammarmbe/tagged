import sql from "@/utils/db";

export async function GET() {
  const data = await sql("SELECT MAX(price - discount) AS max FROM items");

  return new Response(JSON.stringify(data[0].max));
}
