import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { analizeIfStoreIsOpen } from "./utils/analizeIfStoreIsOpen";
import { useState } from "react";
import Cookies from "js-cookie";

export async function middleware(req: NextRequest) {
  const adminRoles = ["admin", "superadmin", "SEO"];
  const token = req.cookies.get("token");
  const { protocol, host, pathname } = req.nextUrl;

  // no dejar entrar a login si tiene sesion inisiada y token correcto
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
  // if (
  //   req.nextUrl.pathname.startsWith("/checkout")
  //   // ||
  //   // req.nextUrl.pathname.startsWith("/cart")
  // ) {
  //   try {
  //     // console.log({ analise: "analise" });
  //     // const settings = req?.cookies?.get("settings")
  //     //   ? JSON.parse(req.cookies.get("settings")!)
  //     //   : undefined;
  //     // console.log({ settings });
  //     // if (!settings) {
  //     //   return NextResponse.redirect(`${protocol}/${host}/`);
  //     // }
  //     // const isOpen = analizeIfStoreIsOpen(settings);
  //     // console.log({ isOpen });
  //     // if (!isOpen) {
  //     //   return NextResponse.redirect(`${protocol}/${host}/`);
  //     // }
  //     return NextResponse.next();
  //   } catch (error) {
  //     console.log({ errorinmiddlewarecart: error });
  //     return NextResponse.redirect(`${protocol}/${host}/`);
  //   }
  // }

  // if (req.nextUrl.pathname.startsWith("/admin/deliver")) {
  //   console.log("entre a pagfina de deliverys");

  //   try {
  //     if (!token) {
  //       console.log("entre a pagfina de deliverys 2");

  //       return NextResponse.redirect(`${protocol}/${host}/`);
  //     }
  //     await jose.jwtVerify(
  //       token || "",
  //       new TextEncoder().encode(process.env.JWT_SECRET_SEED || "")
  //     );
  //     console.log("entre a pagfina de deliverys3");

  //     return NextResponse.next();
  //   } catch (error) {
  //     console.log("entre a pagfina de deliverys4");

  //     return NextResponse.redirect(`${protocol}/${host}/`);
  //   }
  // }

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
  matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/:path*", "/login"],
};
