import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, STUDENT_COOKIE, verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await verifyToken<{ role?: string }>(request.cookies.get(ADMIN_COOKIE)?.value);
    if (session?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/lernen") || pathname.startsWith("/profil")) {
    const session = await verifyToken<{ studentId?: string }>(
      request.cookies.get(STUDENT_COOKIE)?.value,
    );
    if (!session?.studentId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/lernen/:path*", "/profil/:path*"],
};
