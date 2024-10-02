// middleware.ts
import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { lucia } from "./utils/auth";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (request.method === "GET") {
    if (/\.(css|js|png|jpg|jpeg|svg|gif|ttf)$/.test(request.nextUrl.pathname)) {
      return NextResponse.next();
    }

    const sessionId =
      request.cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      if (request.nextUrl.pathname !== "/login")
        return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/login");
      else return NextResponse.next();
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (request.nextUrl.pathname === "/login" && session && user.store) {
      return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/");
    }

    if (!session || !user.store) {
      return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/login");
    }

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
