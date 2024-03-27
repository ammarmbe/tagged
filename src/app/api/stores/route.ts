import sql from "@/utils/db";

export async function GET() {
  const data = await sql("SELECT id, name FROM users WHERE store = true");

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
