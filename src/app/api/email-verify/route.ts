import { EmailTemplate } from "@/components/VerifyEmail";
import { lucia } from "@/utils/auth";
import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { User } from "lucia";
import { customAlphabet } from "nanoid";
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

async function verifyVerificationCode(
  user: User,
  code: string,
): Promise<boolean> {
  const databaseCode = (
    await sql(
      "SELECT code, email, expires_at > NOW() AS expired FROM email_verification_codes WHERE user_id = $1",
      [user.id],
    )
  )[0] as {
    code: string;
    email: string;
    expired: boolean;
  };

  if (
    !databaseCode ||
    databaseCode.code !== code ||
    databaseCode.expired ||
    databaseCode.email !== user.email
  ) {
    return false;
  }

  await sql("DELETE FROM email_verification_codes WHERE user_id = $1", [
    user.id,
  ]);

  return true;
}

export async function POST(req: Request) {
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const codeIsValid = await verifyVerificationCode(
    user,
    (await req.json()).code,
  );

  if (!codeIsValid) {
    return new Response(null, {
      status: 400,
    });
  }

  await lucia.invalidateUserSessions(user.id);
  await sql("UPDATE users SET email_verified = true WHERE id = $1", [user.id]);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}

export async function GET() {
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(null, { status: 401 });
  }

  if (user.emailVerified) {
    return new Response(null, { status: 302, headers: { Location: "/" } });
  }

  const res = await sql(
    "SELECT code, email, expires_at > now() AS expired FROM email_verification_codes WHERE user_id = $1",
    [user.id],
  );

  let verificationToken;

  if (res[0] && !res[0].expired) {
    
    verificationToken = res[0].code;
  } else {
    verificationToken = await generateEmailVerificationCode(
      user.id,
      user.email,
    );
  }

  const data = await resend.emails.send({
    from: "Atlas <verify@ambe.dev>",
    to: [user.email],
    subject: "Verify your email - Atlas",
    text: "Verify your email to start shopping at Atlas",
    react: EmailTemplate({ verificationToken, name: user.name }),
  });

  console.log(data);

  return new Response("OK");
}
