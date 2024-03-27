// middleware.ts
import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { lucia } from "./utils/auth";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const prodectedRoutes = ["/address", "/cart", "/checkout", "/order"];
    const prodected = prodectedRoutes.find((r) =>
      request.nextUrl.pathname.startsWith(r),
    );

    if (prodected) {
      const sessionId =
        request.cookies.get(lucia.sessionCookieName)?.value ?? null;

      if (!sessionId)
        return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/");

      const { session } = await lucia.validateSession(sessionId);

      try {
        if (session?.fresh) {
          const sessionCookie = lucia.createSessionCookie(session.id);
          request.cookies.set(sessionCookie.name, sessionCookie.value);
        }

        if (!session) {
          const sessionCookie = lucia.createBlankSessionCookie();
          request.cookies.set(sessionCookie.name, sessionCookie.value);
        }
      } catch {
        // Next.js throws error when attempting to set cookies when rendering page
      }

      if (!session)
        return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/");

      return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/item/")) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/views`, {
        method: "POST",
        body: JSON.stringify({
          item_id: request.nextUrl.pathname.split("/item/")[1],
          ip: request.ip,
        }),
      });
    }

    if (request.nextUrl.pathname.startsWith("/shop/store/")) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/views`, {
        method: "POST",
        body: JSON.stringify({
          store_id: request.nextUrl.pathname
            .split("/shop/store/")[1]
            .split("-")[1],
          ip: request.ip,
        }),
      });
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
