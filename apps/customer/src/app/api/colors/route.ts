import sql from "@/utils/db";

export async function GET() {
  const colors = await sql("SELECT distinct color FROM item_configs");

  return new Response(JSON.stringify(colors.map((c) => c.color)));
}
