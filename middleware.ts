import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/app/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);

const SESSION_COOKIE = "fw27_session";

type ProtectedRoute = {
    prefix: string;
    roles: string[];
    redirect: string;
};

const PROTECTED: ProtectedRoute[] = [
    { prefix: "/hacker", roles: ["HACKER", "ORGANIZER"], redirect: "/auth/login" },
    { prefix: "/organizer", roles: ["ORGANIZER"], redirect: "/auth/login?error=unauthorized" },
    { prefix: "/judge", roles: ["JUDGE", "ORGANIZER"], redirect: "/auth/login?error=unauthorized" },
];

const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get(SESSION_COOKIE)?.value;

    // Redirect logged-in users away from auth pages
    if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
        if (token) {
            try {
                await jwtVerify(token, JWT_SECRET);
                const session = await prisma.session.findUnique({
                    where: { token },
                    include: { user: true },
                });
                if (session && session.expiresAt > new Date()) {
                    const role = session.user.role;
                    const dest =
                        role === "ORGANIZER" ? "/organizer" : role === "JUDGE" ? "/judge" : "/hacker";
                    return NextResponse.redirect(new URL(dest, req.url));
                }
            } catch {
                // invalid token, continue to auth page
            }
        }
        return NextResponse.next();
    }

    // Protect portal routes
    const matched = PROTECTED.find((p) => pathname.startsWith(p.prefix));
    if (!matched) return NextResponse.next();

    if (!token) {
        return NextResponse.redirect(new URL(matched.redirect, req.url));
    }

    try {
        await jwtVerify(token, JWT_SECRET);
    } catch {
        const res = NextResponse.redirect(new URL(matched.redirect, req.url));
        res.cookies.delete(SESSION_COOKIE);
        return res;
    }

    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        const res = NextResponse.redirect(new URL(matched.redirect, req.url));
        res.cookies.delete(SESSION_COOKIE);
        return res;
    }

    if (!matched.roles.includes(session.user.role)) {
        return NextResponse.redirect(new URL(matched.redirect, req.url));
    }

    // Attach user ID in header for server components
    const res = NextResponse.next();
    res.headers.set("x-user-id", session.user.id);
    res.headers.set("x-user-role", session.user.role);
    return res;
}

export const config = {
    matcher: ["/hacker/:path*", "/organizer/:path*", "/judge/:path*", "/auth/:path*"],
};
