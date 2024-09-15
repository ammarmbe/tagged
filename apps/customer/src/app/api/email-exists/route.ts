import sql from "@/utils/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  const {
    0: { count },
  } = await sql("SELECT count(*) FROM users WHERE email = $1", [email]);

  return new Response(JSON.stringify(count));
}
