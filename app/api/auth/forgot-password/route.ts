import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { normalizeEmail } from "@/app/lib/site";
import { generateVerificationToken, sendPasswordResetEmail } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    if (!email?.trim()) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const normalized = normalizeEmail(email.trim());
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    // Always return success to prevent user enumeration
    if (user) {
        const token = generateVerificationToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: token, resetTokenExpiresAt: expiresAt },
        });
        await sendPasswordResetEmail(normalized, token).catch(console.error);
    }

    return NextResponse.json({ ok: true });
}
