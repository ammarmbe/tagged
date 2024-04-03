import { lucia } from "@/utils/auth";
import sql from "@/utils/db";
import { customAlphabet } from "nanoid";
import { cookies } from "next/headers";
import { EmailTemplate } from "@/components/VerifyEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const nanoId = customAlphabet("1234567890", 6);

async function generateEmailVerificationCode(
  userId: string,
  email: string,
): Promise<string> {
  await sql("DELETE FROM email_verification_codes WHERE user_id = $1", [
    userId,
  ]);

  const code = nanoId();

  await sql(
    "INSERT INTO email_verification_codes (user_id, email, code) VALUES ($1, $2, $3)",
    [userId, email, code],
  );

  return code;
}

export async function POST(req: Request) {
  const {
    email,
    hashedPassword,
    userId,
    name,
  }: {
    email: string;
    hashedPassword: string;
    userId: string;
    name: string;
  } = await req.json();

  await sql(
    "INSERT INTO users (nano_id, email, hashed_password, name) VALUES ($1, $2, $3, $4)",
    [userId, email, hashedPassword, name],
  );

  const verificationToken = await generateEmailVerificationCode(userId, email);
  const data = await resend.emails.send({
    from: "Atlas <verify@ambe.dev>",
    to: [email],
    subject: "Verify your email - Atlas",
    text: `Verify your email to start shopping at Atlas`,
    react: EmailTemplate({ verificationToken, name }),
  });

  console.log(data);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response("OK", {
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}
