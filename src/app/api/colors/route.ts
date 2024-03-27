import sql from "@/utils/db";

export async function GET() {
  const colors = await sql("SELECT distinct color FROM item_details");

  return new Response(JSON.stringify(colors.map((c) => c.color)), {
    headers: {
      "content-type": "application/json",
    },
    status: 200,
  });
}
