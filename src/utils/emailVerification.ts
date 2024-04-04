import "server-only";
import { EmailVerification } from "@/components/email/EmailVerification";
import sql from "./db";
import { customAlphabet } from "nanoid";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const nanoId = customAlphabet("1234567890", 6);

export async function canGenerateCode(userId: string) {
  const data = (
    await sql(
      "SELECT 120 - EXTRACT(epoch FROM NOW() - created_at) AS duration_left, expires_at < NOW() AS expired FROM email_verification_codes WHERE user_id = $1",
      [userId],
    )
  )[0] as { duration_left: number; expired: boolean } | undefined;

  if (data?.expired) {
    return 0;
  }

  return Math.max(Math.floor(data?.duration_left ?? 0), 0);
}

export async function codeExpired(userId: string) {
  const data = (
    await sql(
      "SELECT expires_at < NOW() AS expired FROM email_verification_codes WHERE user_id = $1",
      [userId],
    )
  )[0] as { expired: boolean } | undefined;

  return data?.expired ?? true;
}

export async function generateCode(
  userId: string,
  name: string,
  email: string,
) {
  await sql("DELETE FROM email_verification_codes WHERE user_id = $1", [
    userId,
  ]);

  const code = nanoId();

  await sql(
    "INSERT INTO email_verification_codes (user_id, code) VALUES ($1, $2)",
    [userId, code],
  );

  await resend.emails.send({
    from: "Atlas <verify@atlas.me>",
    to: [email],
    subject: "Verify your email - Atlas",
    text: "Verify your email to start shopping at Atlas",
    react: EmailVerification({ verificationToken: code, name }),
  });

  return code;
}

export async function codeIsValid(userId: string, code: string) {
  const databaseCode = (
    await sql(
      "SELECT code, expires_at < NOW() AS expired FROM email_verification_codes WHERE user_id = $1",
      [userId],
    )
  )[0] as {
    code: string;
    expired: boolean;
  };

  if (!databaseCode || databaseCode.code != code || databaseCode.expired) {
    return false;
  }

  return true;
}
