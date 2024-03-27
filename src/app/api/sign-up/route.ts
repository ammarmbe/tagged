import { lucia } from "@/utils/auth";
import sql from "@/utils/db";
import { cookies } from "next/headers";

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
    "INSERT INTO users (id, email, hashed_password, name) VALUES ($1, $2, $3, $4)",
    [userId, email, hashedPassword, name],
  );

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response("OK", {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
