import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const adminRoles = ["admin", "super-admin", "SEO"];
  // const session: any = await getSession({
  //   req: { headers: { cookie } } as any,
  // });
  // const session: any = await getToken({
  //   req,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  // if (!session) {
  //   if (req.nextUrl.pathname.startsWith("/api/admin")) {
  //     return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
  //   }

  //   const requestedPage = req.nextUrl.pathname;
  //   return NextResponse.redirect(
  //     new URL(`/auth/login?p=${requestedPage}`, req.url)
  //   );
  // }

  // if (req.nextUrl.pathname.startsWith("/admin")) {
  //   if (!adminRoles.includes(session.user.role)) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }

  // if (req.nextUrl.pathname.startsWith("/api/admin")) {
  //   if (!adminRoles.includes(session.user.role)) {
  //     return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
  //   }
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/:path*"],
};
