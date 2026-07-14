import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";

// Requests that change data (everything except safe reads) must carry a valid
// admin session — the admin dashboard calls these routes from the browser, so
// they are the real write path and must be authenticated here, not just in the
// page layout.
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Public write endpoints that must stay open:
//  - /api/inquiry     : the public contact / lead form
//  - /api/cron/*      : Vercel cron, gated separately by CRON_SECRET
const PUBLIC_WRITE_PATHS = ["/api/inquiry", "/api/cron"];

function isPublicWrite(pathname: string): boolean {
  return PUBLIC_WRITE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!MUTATING_METHODS.has(request.method) || isPublicWrite(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value;
  if (await verifySessionToken(token)) {
    return NextResponse.next();
  }

  return NextResponse.json(
    { error: "Unauthorized. Admin session required." },
    { status: 401 }
  );
}

export const config = {
  matcher: ["/api/:path*"],
};
