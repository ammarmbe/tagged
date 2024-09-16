import sql from "@/utils/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  const data = await sql("SELECT count(*) FROM users WHERE email = $1", [email]);

  const count = data[0]?.count;

  return new Response(JSON.stringify(count));
}
