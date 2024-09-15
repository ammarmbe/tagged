"use server";
import { lucia } from "@/utils/auth";
import getUser from "@/utils/getUser";
import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";

export default async function logout(): Promise<ActionResult> {
  const { session } = await getUser();

  if (!session) {
    return;
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
