import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { analizeIfStoreIsOpen } from "./utils/analizeIfStoreIsOpen";

export async function middleware(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const adminRoles = ["admin", "super-admin", "SEO"];
  const token = req.cookies.get("token");
  const { protocol, host, pathname } = req.nextUrl;

  if (
    req.nextUrl.pathname.startsWith("/checkout") ||
    req.nextUrl.pathname.startsWith("/cart")
  ) {
    try {
      const settings = JSON.parse(req.cookies.get("settings") ?? "");
      const isOpen = analizeIfStoreIsOpen(settings);
      if (!isOpen) {
        return NextResponse.redirect(`${protocol}/${host}/`);
      }
    } catch (error) {
      return NextResponse.redirect(`${protocol}/${host}/`);
    }
  }

  if (
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/api/admin")
  ) {
    try {
      if (!token) {
        return NextResponse.redirect(`${protocol}/${host}/`);
      }
      const respToken = await jose.jwtVerify(
        token || "",
        new TextEncoder().encode(process.env.JWT_SECRET_SEED || "")
      );

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(`${protocol}/${host}/`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/:path*", "/cart"],
};
