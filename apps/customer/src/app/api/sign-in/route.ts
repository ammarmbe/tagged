import { lucia } from "@/utils/auth";
import sql from "@/utils/db";
import { Scrypt } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import requestIp from "request-ip";

export async function POST(req: NextRequest) {
  const {
    email,
    password,
  }: {
    email: string;
    password: string;
  } = await req.json();

  const data = await sql(
    "SELECT COUNT(*) AS count FROM incorrect_attempts WHERE ip = $1 AND created_at > NOW() - INTERVAL '5 minutes'",
    [requestIp.getClientIp(req as unknown as requestIp.Request) ?? req.ip],
  );

  if (data[0].count > 5) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const user = await sql(
    "SELECT id, hashed_password FROM users WHERE email = $1",
    [email],
  );

  const validPassword = await new Scrypt().verify(
    user[0]?.hashed_password ?? "",
    password,
  );

  if (!validPassword) {
    await sql("INSERT INTO incorrect_attempts (ip) VALUES ($1)", [
      requestIp.getClientIp(req as unknown as requestIp.Request) ?? req.ip,
    ]);
  }

  if (user.length === 0 || !validPassword) {
    return new Response(JSON.stringify("Email or password are incorrect."), {
      status: 400,
    });
  }

  const session = await lucia.createSession(user[0].id, {});
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

export async function GET(req: NextRequest) {
  const data = await sql(
    "SELECT COUNT(*) AS count FROM incorrect_attempts WHERE ip = $1 AND created_at > NOW() - INTERVAL '5 minutes'",
    [requestIp.getClientIp(req as unknown as requestIp.Request) ?? req.ip],
  );

  if (data[0].count > 5) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  return new Response("OK");
}
