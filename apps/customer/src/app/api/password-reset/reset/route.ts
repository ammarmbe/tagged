import sql from "@/utils/db";

export async function POST(req: Request) {
  const { hashedPassword, code } = await req.json();

  const data = (
    await sql("SELECT user_id FROM password_reset_codes WHERE code = $1", [
      code,
    ])
  )[0];

  if (!data) {
    return new Response("Invalid code", {
      status: 400,
    });
  }

  await sql("UPDATE users SET hashed_password = $1 WHERE id = $2", [
    hashedPassword,
    data.user_id,
  ]);

  await sql("DELETE FROM password_reset_codes WHERE code = $1", [code]);

  return new Response("OK");
}
