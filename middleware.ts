import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { analizeIfStoreIsOpen } from "./utils/analizeIfStoreIsOpen";
import { useState } from "react";
import Cookies from "js-cookie";

type Environment = "production" | "development" | "other";

export async function middleware(req: NextRequest) {
  const adminRoles = ["admin", "superadmin", "SEO"];
  const token = req.cookies.get("token");
  const { protocol, host, pathname } = req.nextUrl;

  const currentEnv = process.env.NODE_ENV as Environment;

  if (req.nextUrl.pathname === "/") {
    // console.log({
    //   currentEnv: `https://${req.headers.get("host")}${req.nextUrl.pathname}`,
    // });
    console.log({ bla: req.nextUrl.protocol.replaceAll(":", "") });
    if (
      currentEnv === "production" &&
      req.nextUrl.protocol.replaceAll(":", "") !== "https"
    ) {
      return NextResponse.redirect(
        `https://${req.nextUrl.host}${req.nextUrl.pathname}`,
        301
      );
      // return NextResponse.next();
    }
  }
  // }

  // no dejar entrar a login si tiene sesion iniciada y token correcto
  if (req.nextUrl.pathname.startsWith("/login")) {
    try {
      if (!token) {
        return NextResponse.next();
      }
      await jose.jwtVerify(
        token || "",
        new TextEncoder().encode(process.env.JWT_SECRET_SEED || "")
      );
      return NextResponse.redirect(`${protocol}/${host}/`);
    } catch (error) {
      Cookies.remove("token");
      return NextResponse.next();
    }
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    try {
      if (!token) {
        return NextResponse.redirect(`${protocol}/${host}/`);
      }

      const session = await jose.jwtVerify(
        token || "",
        new TextEncoder().encode(process.env.JWT_SECRET_SEED || "")
      );

      if (!adminRoles.includes(session?.payload?.role as string)) {
        if (req.nextUrl.pathname.startsWith("/admin/deliver")) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(`${protocol}/${host}/`);
        }
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(`${protocol}/${host}/`);
    }
  }
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    try {
      if (!token) {
        return NextResponse.redirect(`${protocol}/${host}/`);
      }

      await jose.jwtVerify(
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
  matcher: [
    "/checkout/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/login",
    "/",
  ],
};
