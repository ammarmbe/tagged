"use server";

import { lucia } from "@/utils/auth";
import getUser from "@/utils/getUser";
import { cookies } from "next/headers";

export default async function logout() {
  const { session } = await getUser();

  if (!session) {
    return;
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
