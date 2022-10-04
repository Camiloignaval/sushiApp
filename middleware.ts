import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { analizeIfStoreIsOpen } from "./utils/analizeIfStoreIsOpen";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export async function middleware(req: NextRequest) {
  console.log({ entre: "entre a middleware" });
  const cookie = req.headers.get("cookie");
  const adminRoles = ["admin", "super-admin", "SEO"];
  const token = req.cookies.get("token");
  const { protocol, host, pathname } = req.nextUrl;

  if (
    req.nextUrl.pathname.startsWith("/checkout") ||
    req.nextUrl.pathname.startsWith("/cart")
  ) {
    try {
      // console.log({ analise: "analise" });
      // const settings = req?.cookies?.get("settings")
      //   ? JSON.parse(req.cookies.get("settings")!)
      //   : undefined;
      // console.log({ settings });
      // if (!settings) {
      //   return NextResponse.redirect(`${protocol}/${host}/`);
      // }
      // const isOpen = analizeIfStoreIsOpen(settings);
      // console.log({ isOpen });
      // if (!isOpen) {
      //   return NextResponse.redirect(`${protocol}/${host}/`);
      // }
    } catch (error) {
      console.log({ errorinmiddlewarecart: error });
      return NextResponse.redirect(`${protocol}/${host}/`);
    }
  }

  if (
    req.nextUrl.pathname.startsWith("/admin") ||
    // TODO arreglar no deja cargar pagina
    req.nextUrl.pathname.startsWith("/api/admin")
  ) {
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
  matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/:path*", "/cart"],
};
