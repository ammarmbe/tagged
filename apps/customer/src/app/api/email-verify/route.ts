import { lucia } from "@/utils/auth";
import sql from "@/utils/db";
import {
  canGenerateCode,
  codeIsValid,
  generateCode,
} from "@/utils/emailVerification";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const { user } = await getUser();
  const { code } = await req.json();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (user.emailVerified) {
    return new Response(null, { status: 302, headers: { Location: "/" } });
  }

  if (!(await codeIsValid(user.id, code))) {
    return new Response(null, {
      status: 400,
    });
  }

  await lucia.invalidateUserSessions(user.id);
  await sql("UPDATE users SET email_verified = true WHERE id = $1", [user.id]);
  await sql("DELETE FROM email_verification_codes WHERE user_id = $1", [
    user.id,
  ]);

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

  if ((await canGenerateCode(user.id)) === 0) {
    generateCode(user.id, user.name, user.email);
  }

  return new Response("OK");
}
