import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const base = () => process.env.APP_URL ?? "http://localhost:2027";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login?error=invalid_token", base()));
    }

    const user = await prisma.user.findUnique({
        where: { verificationToken: token },
    });

    if (!user || !user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
        return NextResponse.redirect(new URL("/auth/login?error=expired_token", base()));
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, verificationToken: null, tokenExpiresAt: null },
    });

    return NextResponse.redirect(new URL("/auth/login?verified=1", base()));
}
