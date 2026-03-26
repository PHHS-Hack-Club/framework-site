import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
        return NextResponse.json({ error: "Reset link is invalid or has expired." }, { status: 400 });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash: await hashPassword(password),
            resetToken: null,
            resetTokenExpiresAt: null,
        },
    });

    // Invalidate all existing sessions
    await prisma.session.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ ok: true });
}
