import { lucia } from "@/utils/auth";
import sql from "@/utils/db";
import { Scrypt } from "lucia";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const {
    email,
    password,
  }: {
    email: string;
    password: string;
  } = await req.json();

  const user = await sql(
    "SELECT id, hashed_password FROM users WHERE email = $1",
    [email],
  );

  const validPassword = await new Scrypt().verify(
    user[0]?.hashed_password ?? "",
    password,
  );

  if (user.length === 0 || !validPassword) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  const session = await lucia.createSession(user[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  console.log(sessionCookie);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}
