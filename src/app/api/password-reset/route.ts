import sql from "@/utils/db";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import { PasswordTemplate } from "@/components/email/ResetPassword";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const data = (
    await sql(
      "SELECT created_at + INTERVAL '5 minutes' < NOW() as old FROM password_reset_codes WHERE ip = $1",
      [req.ip ?? null],
    )
  )[0];

  if (data?.old === false) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  return new Response("OK");
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const code = nanoid();

  const data = (
    await sql(
      "SELECT created_at + INTERVAL '5 minutes' < NOW() as old FROM password_reset_codes WHERE ip = $1",
      [req.ip ?? null],
    )
  )[0];

  if (data?.old === false) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const user = await sql("SELECT name, id FROM users WHERE email = $1", [
    email,
  ]);

  if (!user.length) {
    return new Response("User not found", {
      status: 400,
    });
  }

  await sql(
    "INSERT INTO password_reset_codes (code, user_id, ip) VALUES ($1, $2, $3)",
    [code, user[0]?.id, req.ip],
  );

  await resend.emails.send({
    from: "Atlas <password@atlas.me>",
    to: [email],
    subject: "Reset your password - Atlas",
    text: "Reset your password",
    react: PasswordTemplate({ code, name: user[0]?.name }),
  });

  return new Response("OK");
}
