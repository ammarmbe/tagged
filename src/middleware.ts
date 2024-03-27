// middleware.ts
import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { lucia } from "./utils/auth";
import { getBaseUrl } from "./utils";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    if (/\.(css|js|png|jpg|jpeg|svg|gif)$/.test(request.nextUrl.pathname)) {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname === "/login") return NextResponse.next();

    const sessionId =
      request.cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) return NextResponse.redirect(getBaseUrl() + "/login");
    const { session, user } = await lucia.validateSession(sessionId);

    if (!session || !user.store)
      return NextResponse.redirect(getBaseUrl() + "/login");

    return NextResponse.next();
  }

  const originHeader = request.headers.get("Origin");
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get("Host");

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return NextResponse.next();
}
